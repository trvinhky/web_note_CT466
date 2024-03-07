const isValidEmail = (email: string) => {
    // Biểu thức chính quy để kiểm tra địa chỉ email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

const isValidPhoneVN = (phone: string) => {
    // Biểu thức chính quy để kiểm tra số điện thoại vn
    const regex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
    return regex.test(phone);
}

const isValidPassword = (password: string) => {
    // Biểu thức chính quy để kiểm tra độ mạnh mật khẩu
    const regex = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/;
    return regex.test(password);
}

// kiểm tra độ dài câu
const isValidText = (text: string) => {
    return text.trim().length > 6;
}

export {
    isValidEmail,
    isValidPhoneVN,
    isValidPassword,
    isValidText
}