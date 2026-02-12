import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserModal from '@/modules/user/components/UserModal';
import { useCompleteProfile } from '../hooks/useCompleteProfile';

export default function CompleteProfileCard() {
  const {
    shouldShow,
    showModal,
    setShowModal,
    handleCompleteProfile,
    handleSaveProfile,
    handlePasswordReset,
    currentUser,
    translate,
  } = useCompleteProfile();

  // displayName debe venir de currentUser
  const displayName = currentUser?.displayName || '';

  if (!shouldShow) {
    return null;
  }

  return (
    <div className="col-span-12">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-secondary p-6 shadow-xl">
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-surface/60 backdrop-blur-sm">
                  <FontAwesomeIcon 
                    icon={["fas", "user-circle"]} 
                    className="text-2xl text-text-on-primary"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-on-primary truncate max-w-[250px] sm:max-w-full">
                    {translate.pages.home.welcomeUser.replace('{name}', displayName || '')}
                  </h3>
                  <p className="text-sm text-primary-foreground">
                    {translate.pages.home.completeProfile}
                  </p>
                </div>
              </div>

              <div className="bg-surface/70 backdrop-blur-sm rounded-lg p-4 mb-4">
                <p className="text-text-on-primary text-sm mb-3">
                  {translate.pages.home.completeProfileMessage}
                </p>
                <ul className="space-y-2 text-sm text-text-on-primary/90">
                  <li className="flex items-center gap-2">
                    <FontAwesomeIcon icon={["fas", "check-circle"]} className="text-success" />
                    {translate.pages.home.completeProfileItems.birthdate}
                  </li>
                  <li className="flex items-center gap-2">
                    <FontAwesomeIcon icon={["fas", "check-circle"]} className="text-success" />
                    {translate.pages.home.completeProfileItems.nationality}
                  </li>
                  <li className="flex items-center gap-2">
                    <FontAwesomeIcon icon={["fas", "check-circle"]} className="text-green-300" />
                    {translate.pages.home.completeProfileItems.photo}
                  </li>
                </ul>
              </div>

              <button
                onClick={handleCompleteProfile}
                className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <FontAwesomeIcon icon={["fas", "edit"]} />
                {translate.pages.home.completeProfileTitle}
              </button>
            </div>

            <div className="hidden md:block">
              <FontAwesomeIcon 
                icon={["fas", "clipboard-check"]} 
                className="text-8xl text-white/10"
              />
            </div>
          </div>
        </div>

        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
      </div>

      {/* Modal de completar perfil */}
      <UserModal
        open={showModal}
        onClose={() => setShowModal(false)}
        mode="edit"
        user={currentUser}
        onSave={handleSaveProfile}
        onPasswordReset={handlePasswordReset}
      />
    </div>
  );
}
