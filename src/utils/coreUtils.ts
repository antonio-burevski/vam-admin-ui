export const extractErrorMessage = (data: any) => {
    if (typeof data === "string") return data;

    if (typeof data === "object" && data !== null) {
        const firstKey = Object.keys(data)[0];
        if (Array.isArray(data[firstKey])) {
            return data[firstKey][0]; // Return first error string
        }
    }
    return "Registration failed";
};