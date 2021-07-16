export function normalizeRecordId(e) {
    if (!e) {
        return null;
    }

    if (e.length === 15) {
        let t = "";
        const n = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456";

        for (let r = 0; r < 3; ++r) {
            let l = 0;

            for (let t = 0; t < 5; t++) {
                const n = e.charAt(5 * r + t);
                n >= "A" && n <= "Z" && (l += 1 << t)
            }

            t += n.charAt(l)
        }

        return e + t
    }
    return e.length === 18 ? e : null;
}
