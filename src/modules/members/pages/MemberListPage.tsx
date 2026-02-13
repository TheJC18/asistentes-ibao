import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from '@/core/context/LanguageContext';
import { UserCard } from '@/core/components/common';
import { useMemberList } from '../hooks/useMemberList';

export default function MemberListPage() {
  const translate = useTranslation();
  const {
    filteredMembers,
    isLoading,
    error,
    filter,
    searchTerm,
    totalMembers,
    membersCount,
    nonMembersCount,
    handleFilterChange,
    handleSearchChange,
  } = useMemberList();

  return (
		<div className="relative min-h-[80vh]">
			<div className="p-4 md:p-6">
				{/* Header con icono centrado - mismo estilo que otras páginas */}
				<div className="flex flex-col items-center mb-6">
					<div className="flex items-center gap-3 mb-4">
						<FontAwesomeIcon icon={["fas", "user-check"]} className="text-primary text-3xl" />
						<h2 className="text-3xl font-bold text-text-primary">{translate.nav.members}</h2>
					</div>
				</div>
				
				{/* Barra de búsqueda */}
				<div className="mb-6">
					<input
						type="text"
						value={searchTerm}
						onChange={handleSearchChange}
						className="w-full rounded-xl border border-border px-5 py-4 text-lg focus:ring-2 focus:ring-primary bg-background text-text-primary shadow-sm"
						placeholder={translate.pages.members.searchPlaceholder}
					/>
				</div>
				
				{/* Filtros */}
				<div className="mb-6 flex flex-wrap gap-3 justify-center">
					<button
						onClick={() => handleFilterChange('all')}
						className={`px-6 py-3 rounded-lg font-semibold transition-all ${
							filter === 'all'
								? 'bg-primary text-text-on-primary shadow-lg scale-105'
								: 'bg-card text-text-primary border border-border hover:bg-surface'
						}`}
					>
						<FontAwesomeIcon icon={["fas", "users"]} className="mr-2" />
						{translate.pages.members.all} ({totalMembers})
					</button>
					
					<button
						onClick={() => handleFilterChange('members')}
						className={`px-6 py-3 rounded-lg font-semibold transition-all ${
							filter === 'members'
								? 'bg-success text-text-on-primary shadow-lg scale-105'
								: 'bg-card text-text-primary border border-border hover:bg-surface'
						}`}
					>
						<FontAwesomeIcon icon={["fas", "user-check"]} className="mr-2" />
						{translate.pages.members.members} ({membersCount})
					</button>
					
					<button
						onClick={() => handleFilterChange('non-members')}
						className={`px-6 py-3 rounded-lg font-semibold transition-all ${
							filter === 'non-members'
								? 'bg-warning text-text-on-primary shadow-lg scale-105'
								: 'bg-card text-text-primary border border-border hover:bg-surface'
						}`}
					>
						<FontAwesomeIcon icon={["fas", "user-xmark"]} className="mr-2" />
						{translate.pages.members.attendees} ({nonMembersCount})
					</button>
				</div>
				
				{/* Estado de carga */}
				{isLoading && (
					<div className="flex justify-center items-center py-12">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
					</div>
				)}
				
				{/* Error */}
				{error && (
					<div className="bg-error/10 border border-error text-error px-4 py-3 rounded-lg mb-6">
						<FontAwesomeIcon icon={["fas", "exclamation-triangle"]} className="mr-2" />
						{error}
					</div>
				)}
				
				{/* Lista de miembros */}
				{!isLoading && !error && filteredMembers.length === 0 && (
					<div className="text-center py-12">
						<FontAwesomeIcon 
							icon={["fas", "users-slash"]} 
							className="text-6xl text-text-disabled mb-4" 
						/>
						<p className="text-xl text-text-secondary">
							{searchTerm 
								? translate.pages.members.noSearchResults
								: filter === 'members'
								? translate.pages.members.noMembersFound
								: filter === 'non-members'
								? translate.pages.members.noAttendeesFound
								: translate.pages.members.noUsersFound
							}
						</p>
					</div>
				)}
				
				{!isLoading && !error && filteredMembers.length > 0 && (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{filteredMembers.map((member) => (
							<UserCard 
								key={member.id}
								user={member}
								showRelation={false}
								showPhone={true}
								showNationality={true}
								showFamilySection={true}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}