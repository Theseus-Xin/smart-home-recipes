// src/utils/feedback.ts
export function showMessage(title: string) {
    uni.showToast({
        title,
        icon: 'none',
    })
}

export function showSuccess(title: string) {
    uni.showToast({
        title,
        icon: 'success',
    })
}

export function confirmAction(
    title: string,
    content: string,
): Promise<boolean> {
    return new Promise((resolve) => {
        uni.showModal({
            title,
            content,
            success: (result) => resolve(result.confirm),
            fail: () => resolve(false),
        })
    })
}
