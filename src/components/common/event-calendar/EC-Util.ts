import { TAG_FUNC_P_ATTND, patron } from "./Constants"

export const calNumOfPatron = (patrons: patron[]) => {
    const totalPatronAttnd = patrons?.reduce((total: number, entry: patron) => {
        if (entry && entry[TAG_FUNC_P_ATTND] !== undefined) {
            return total + parseInt(entry[TAG_FUNC_P_ATTND], 10)
        }
        return total
    }, 0)
    return totalPatronAttnd ?? 0
}