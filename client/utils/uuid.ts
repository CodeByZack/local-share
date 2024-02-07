const CHARTS = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm0123456789";
export const getUniqueId = (len = 10) => {
    const chars = new Array(len - 1).fill("");
    return (CHARTS[Math.floor(Math.random() * 52)] +
        chars.map(() => CHARTS[Math.floor(Math.random() * CHARTS.length)]).join(""));
};