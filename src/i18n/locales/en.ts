import { TranslationKeys } from './es';

export const en: TranslationKeys = {
  // Navigation and menu
  nav: {
    home: 'Home',
    users: 'Users',
    family: 'My Family',
    members: 'Members',
  },

  // Common
  common: {
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    close: 'Close',
    search: 'Search',
    add: 'Add',
    create: 'Create',
    loading: 'Loading...',
    noData: 'No data',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No',
    accept: 'Accept',
    user: 'User',
    noEmail: 'No email',
    editProfile: 'Edit my profile',
    support: 'Support',
    profileUpdated: 'Profile updated successfully',
    errorUpdatingProfile: 'Could not update profile',
    unexpectedErrorProfile: 'An error occurred while updating profile',
    emailSent: 'Email sent',
    emailSentMessage: 'A reset email has been sent to {email}',
    errorSendingEmail: 'Could not send email',
    unexpectedEmailError: 'An error occurred while sending reset email',
    viewDetails: 'View details',
    editUser: 'Edit user',
    deleteUser: 'Delete user',
  },

  // Forms
  form: {
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    birthdate: 'Birthdate',
    gender: 'Gender',
    nationality: 'Nationality',
    password: 'Password',
    confirmPassword: 'Confirm password',
    role: 'Role',
    relation: 'Relation',
    isMember: 'Is member?',
    hasWebAccess: 'Web access',
    avatar: 'Avatar',
    actions: 'Actions',
    noName: 'No name',
    birth: 'Birth',
  },

  // Genders
  gender: {
    male: 'Male',
    female: 'Female',
    other: 'Other',
  },

  // Roles
  role: {
    admin: 'Admin',
    user: 'User',
    adminBadge: 'ADMIN',
    userBadge: 'USER',
  },

  // Pages
  pages: {
    home: {
      title: 'Home',
      welcome: 'Welcome',
      welcomeUser: 'Welcome, {name}!',
      completeProfile: 'Complete your profile to access all features',
      completeProfileTitle: 'Complete my profile',
      completeProfileMessage: 'To start using the platform, we need you to complete your personal information:',
      completeProfileItems: {
        birthdate: 'Date of birth',
        nationality: 'Nationality',
        photo: 'Profile photo',
      },
      profileCompleted: 'Profile completed!',
      profileCompletedMessage: 'Your profile has been successfully updated. You can now access all platform features.',
      savingProfile: 'Saving profile...',
      pleaseWait: 'Please wait a moment',
      errorSaving: 'Error saving',
      errorSavingMessage: 'Could not update your profile. Please try again.',
      unexpectedError: 'Unexpected error',
      unexpectedErrorMessage: 'An error occurred while saving your profile. Please try again.',
    },
    users: {
      title: 'User Management',
      description: 'Registered users in the application',
      addUser: 'Add user',
      editUser: 'Edit user',
      deleteUser: 'Delete user?',
      noUsers: 'No registered users',
    },
    family: {
      title: 'My Family',
      addMember: 'Add family member',
      addFamiliar: 'Add relative',
      editMember: 'Edit relative',
      deleteMember: 'Remove from my family',
      noMembers: 'No members in your family',
      searchPlaceholder: 'Search member, relation...',
    },
    members: {
      title: 'Members',
      searchPlaceholder: 'Search members...',
    },
  },

  // Authentication
  auth: {
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    forgotPassword: 'Forgot password?',
    rememberMe: 'Remember me',
    loginWithGoogle: 'Continue with Google',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    createNewAccount: 'Create new account',
    signInHere: 'Sign in here',
    enterCredentials: 'Enter with your credentials!',
    registerWithData: 'Register with your data',
    google: 'Google',
    fullName: 'Full name',
    emailPlaceholder: 'Email',
    passwordPlaceholder: 'Password',
    fullNamePlaceholder: 'Full name',
  },

  // Messages
  messages: {
    success: {
      saved: 'Saved successfully',
      deleted: 'Deleted successfully',
      updated: 'Updated successfully',
      created: 'Created successfully',
    },
    error: {
      generic: 'An error occurred',
      notFound: 'Not found',
      unauthorized: 'Unauthorized',
      required: 'This field is required',
    },
    validation: {
      emailInvalid: 'Email must contain an @',
      passwordLength: 'Password must be at least 6 characters',
      nameRequired: 'Name is required',
      passwordsMustMatch: 'Passwords must match',
    },
  },

  // UserCard
  userCard: {
    webAccess: 'Web access',
    member: 'Member',
    age: 'years old',
  },

  // Family relations
  relations: {
    titular: 'Owner',
    spouse: 'Wife',
    son: 'Son',
    daughter: 'Daughter',
    father: 'Father',
    mother: 'Mother',
    brother: 'Brother',
    sister: 'Sister',
    grandfather: 'Grandfather',
    grandmother: 'Grandmother',
    grandson: 'Grandson',
    granddaughter: 'Granddaughter',
  },
};
