import { routes, type RouteName } from './routes'

export type NavigationMethod = 'push' | 'replace' | 'reLaunch' | 'switchTab'

export interface RouteTarget {
    name: RouteName
    query?: Record<string, string | number | boolean>
}

export interface GuardRoute extends RouteTarget {
    path: string
    title: string
}

export type GuardResult = boolean | RouteTarget

export type NavigationGuard = (
    to: GuardRoute,
    from: GuardRoute | null,
) => GuardResult | Promise<GuardResult>

const guards: NavigationGuard[] = []

function getCurrentRoute(): GuardRoute | null {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]

    if (!currentPage) {
        return null
    }

    const path = `/${currentPage.route}`

    const matched = Object.entries(routes).find(
        ([, route]) => route.path === path,
    )

    if (!matched) {
        return null
    }

    const [name, route] = matched as [RouteName, (typeof routes)[RouteName]]

    return {
        name,
        path: route.path,
        title: route.title,
    }
}

function resolveTarget(target: RouteTarget): GuardRoute {
    const route = routes[target.name]

    if (!route) {
        throw new Error(`未注册的页面路由：${target.name}`)
    }

    return {
        ...target,
        path: route.path,
        title: route.title,
    }
}

function buildUrl(target: GuardRoute): string {
    const query = target.query

    if (!query || Object.keys(query).length === 0) {
        return target.path
    }

    const queryString = Object.entries(query)
        .map(([key, value]) => {
            return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
        })
        .join('&')

    return `${target.path}?${queryString}`
}

function callUniNavigation(
    method: NavigationMethod,
    url: string,
): Promise<void> {
    return new Promise((resolve, reject) => {
        const options = {
            url,
            success: () => resolve(),
            fail: (error: unknown) => reject(error),
        }

        switch (method) {
            case 'push':
                uni.navigateTo(options)
                break

            case 'replace':
                uni.redirectTo(options)
                break

            case 'reLaunch':
                uni.reLaunch(options)
                break

            case 'switchTab':
                uni.switchTab({ ...options, url: url.split('?')[0] })
                break
        }
    })
}

async function runGuards(
    initialTarget: GuardRoute,
    from: GuardRoute | null,
): Promise<GuardRoute | null> {
    let target = initialTarget

    // 限制重定向次数，避免守卫之间互相重定向造成死循环
    for (let redirectCount = 0; redirectCount < 10; redirectCount += 1) {
        let redirected = false

        for (const guard of guards) {
            const result = await guard(target, from)

            if (result === false) {
                return null
            }

            if (result !== true) {
                target = resolveTarget(result)
                redirected = true
                break
            }
        }

        if (!redirected) {
            return target
        }
    }

    console.error('路由守卫重定向次数过多')
    return null
}

async function navigate(
    target: RouteTarget,
    method: NavigationMethod,
): Promise<boolean> {
    let resolvedTarget = resolveTarget(target)

    if (method === 'switchTab' && target.query) {
        throw new Error('switchTab 目标页面不能携带 query 参数')
    }

    const from = getCurrentRoute()
    const guardedTarget = await runGuards(resolvedTarget, from)

    if (!guardedTarget) {
        return false
    }

    resolvedTarget = guardedTarget

    await callUniNavigation(method, buildUrl(resolvedTarget))
    return true
}

export const router = {
    /**
     * 入栈跳转，等价于 uni.navigateTo
     */
    push(target: RouteTarget) {
        return navigate(target, 'push')
    },

    /**
     * 替换当前页，等价于 uni.redirectTo
     */
    replace(target: RouteTarget) {
        return navigate(target, 'replace')
    },

    /**
     * 关闭所有页面并打开目标页，等价于 uni.reLaunch
     */
    reLaunch(target: RouteTarget) {
        return navigate(target, 'reLaunch')
    },

    /**
     * 跳转到 tabBar 页面，等价于 uni.switchTab
     */
    switchTab(target: RouteTarget) {
        return navigate(target, 'switchTab')
    },

    /**
     * 返回上一页。uni-app 的返回手势和系统返回仍由 uni-app 管理。
     */
    back(delta = 1) {
        uni.navigateBack({ delta })
    },

    beforeEach(guard: NavigationGuard) {
        guards.push(guard)

        // 返回移除函数，便于测试或动态注册时清理
        return () => {
            const index = guards.indexOf(guard)
            if (index >= 0) {
                guards.splice(index, 1)
            }
        }
    },
}
