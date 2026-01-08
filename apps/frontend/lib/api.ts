export const fetchHistory = async (roomId: string) => {
    const res = await fetch(
        `http://localhost:3000/messages?roomId=${roomId}`
    );
    return res.json();
}