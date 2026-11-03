export type RouteName = 'home' | 'addRecipe' | 'orderMenu'

export interface AppRoute {
    path: string
    title: string
    // 预留给后续登录、权限控制
    meta?: {
        requiresAuth?: boolean
    }
}

export const routes: Record<RouteName, AppRoute> = {
    home: {
        path: '/pages/index/index',
        title: '家常菜谱',
    },
    addRecipe: {
        path: '/pages/add-recipe/index',
        title: '添加菜谱',
    },
    orderMenu: {
        path: '/pages/order-menu/index',
        title: '开始点菜',
    },
}
