type User = {
    [key: string]: any; // 👈️ variable key
    user_id: string,
    email: string,
    time_zone: string,
    first_name: string,
    last_name: string,
    language?: string,
}

export type {
    User
}

export const parseUserData = (value: any = {}) => {
    return {
        user_id: value?.user_id || value?.uid || null,
        email: value?.email || "",
        time_zone: value?.time_zone || "",
        first_name: value?.first_name || "",
        last_name: value?.last_name || "",
        language: value?.language || "",
    }
}
