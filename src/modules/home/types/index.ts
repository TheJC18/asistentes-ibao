// --- Complete Profile Types ---
export interface CompleteProfileUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  avatar: string;
  name: string;
}

export interface CompleteProfileHookResult {
  shouldShow: boolean;
  showModal: boolean;
  setShowModal: (open: boolean) => void;
  handleCompleteProfile: () => void;
  handleSaveProfile: (userData: any) => Promise<void>;
  handlePasswordReset: (email: string) => Promise<void>;
  currentUser: CompleteProfileUser;
  translate: any;
}
