import type { User } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function filterUserBySearch(u: User, search: string) {
  const name = u.displayName || u.name || '';
  const email = u.email || '';
  return name.toLowerCase().includes(search.toLowerCase()) || email.toLowerCase().includes(search.toLowerCase());
}

export function renderUserActions({
  userItem,
  translate,
  handleView,
  handleEdit,
  handleDelete,
  isDeleting
}: {
  userItem: User;
  translate: any;
  handleView: (u: User) => void;
  handleEdit: (u: User) => void;
  handleDelete: (u: User) => void;
  isDeleting: boolean;
}) {
  return (
    <div className="flex flex-row gap-1 items-center justify-center">
      <button 
        className="p-1 h-7 w-7 text-xs rounded-full bg-info hover:bg-info/80 text-text-on-primary transition" 
        title={translate.common.viewDetails} 
        onClick={() => handleView(userItem)}
        disabled={isDeleting}
      >
        <FontAwesomeIcon icon={["fas", "eye"]} />
      </button>
      <button 
        className="p-1 h-7 w-7 text-xs rounded-full bg-success hover:bg-success/80 text-text-on-primary transition" 
        title={translate.common.editUser} 
        onClick={() => handleEdit(userItem)}
        disabled={isDeleting}
      >
        <FontAwesomeIcon icon={["fas", "edit"]} />
      </button>
      <button 
        className={`p-1 h-7 w-7 text-xs rounded-full transition ${
          isDeleting 
            ? 'bg-surface text-text-disabled cursor-not-allowed' 
            : 'bg-error hover:bg-error/80 text-text-on-primary'
        }`}
        title={translate.common.deleteUser} 
        onClick={() => handleDelete(userItem)}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <FontAwesomeIcon icon={["fas", "spinner"]} className="animate-spin" />
        ) : (
          <FontAwesomeIcon icon={["fas", "trash"]} />
        )}
      </button>
    </div>
  );
}
