// src/constants/translations.ts

export const translations = {
  en: {
    // Common
    settings: 'Settings',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    logout: 'Logout',
    
    // Auth
    login: 'Log In',
    signUp: 'Sign Up',
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot Password',
    
    // Profile
    profile: 'Profile',
    fullName: 'Full Name',
    mobileNumber: 'Mobile Number',
    dateOfBirth: 'Date of Birth',
    
    // Settings
    account: 'Account',
    changePassword: 'Change Password',
    deleteAccount: 'Delete Account',
    preferences: 'Preferences',
    darkMode: 'Dark Mode',
    language: 'Language',
    privacy: 'Privacy',
    permissions: 'Permissions',
    about: 'About',
    version: 'Version',
    
    // Messages
    success: 'Success',
    error: 'Error',
    loginSuccess: 'Login successful!',
    logoutConfirm: 'Are you sure you want to logout?',
    deleteAccountConfirm: 'This action cannot be undone. All your data will be permanently deleted.',
  },
  
  vi: {
    // Common
    settings: 'Cài đặt',
    save: 'Lưu',
    cancel: 'Hủy',
    confirm: 'Xác nhận',
    delete: 'Xóa',
    edit: 'Sửa',
    logout: 'Đăng xuất',
    
    // Auth
    login: 'Đăng nhập',
    signUp: 'Đăng ký',
    email: 'Email',
    password: 'Mật khẩu',
    forgotPassword: 'Quên mật khẩu',
    
    // Profile
    profile: 'Hồ sơ',
    fullName: 'Họ và tên',
    mobileNumber: 'Số điện thoại',
    dateOfBirth: 'Ngày sinh',
    
    // Settings
    account: 'Tài khoản',
    changePassword: 'Đổi mật khẩu',
    deleteAccount: 'Xóa tài khoản',
    preferences: 'Tùy chọn',
    darkMode: 'Chế độ tối',
    language: 'Ngôn ngữ',
    privacy: 'Quyền riêng tư',
    permissions: 'Quyền truy cập',
    about: 'Giới thiệu',
    version: 'Phiên bản',
    
    // Messages
    success: 'Thành công',
    error: 'Lỗi',
    loginSuccess: 'Đăng nhập thành công!',
    logoutConfirm: 'Bạn có chắc chắn muốn đăng xuất?',
    deleteAccountConfirm: 'Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn.',
  },
};

export type TranslationKey = keyof typeof translations.en;
export type Language = 'en' | 'vi';