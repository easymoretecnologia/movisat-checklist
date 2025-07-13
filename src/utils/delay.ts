export default async function delay (time: number) {
    const timer = (t: number) => new Promise(resolve => setTimeout(resolve, t))

    await timer(time)
}