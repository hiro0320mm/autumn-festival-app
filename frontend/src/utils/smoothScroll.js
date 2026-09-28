export const smoothScroll = (targetId) => {
    const target = document.getElementById(targetId)

    if (!target) return

    const start = window.scrollY
    const end = target.getBoundingClientRect().top + window.scrollY
    const distance = end - start

    const duration = 700
    let startTime = null

    const easeInOut = (t) => {
        return t < 0.5
            ? 2 * t * t
            : 1 - Math.pow(-2 * t + 2, 2) / 2
    }

    const animation = (currentTime) => {
        if (startTime === null) {
            startTime = currentTime
        }

        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)

        window.scrollTo(
            0,
            start + distance * easeInOut(progress)
        )

        if (progress < 1) {
            requestAnimationFrame(animation)
        }
    }

    requestAnimationFrame(animation)
}