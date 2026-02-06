import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from '@/core/context/LanguageContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/core/store';
import { fetchAllMembers, setFilter, setSearchTerm } from '@/modules/members/store';
import { UserCard } from '@/core/components/common';

type FilterType = 'all' | 'members' | 'non-members';

export default function MemberListPage() {
	const translate = useTranslation();
	const dispatch = useDispatch<AppDispatch>();
	
	const { 
		members,
		filteredMembers, 
		isLoading, 
		error, 
		filter, 
		searchTerm,
		totalMembers 
	} = useSelector((state: RootState) => state.members);
	
	// Cargar todos los miembros al montar el componente (solo una vez)
	useEffect(() => {
		dispatch(fetchAllMembers({ filter: 'all' }));
	}, [dispatch]);
	
	const handleFilterChange = (newFilter: FilterType) => {
		dispatch(setFilter(newFilter));
	};
	
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		dispatch(setSearchTerm(e.target.value));
	};
	
	// Calcular estadísticas sobre TODOS los miembros (no los filtrados)
	const membersCount = members.filter(m => m.isMember).length;
	const nonMembersCount = members.filter(m => !m.isMember).length;
	
	return (
		<div className="relative min-h-[80vh] dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
			<div className="p-4 md:p-6">
				{/* Header con icono centrado - mismo estilo que otras páginas */}
				<div className="flex flex-col items-center mb-6">
					<div className="flex items-center gap-3 mb-4">
						<FontAwesomeIcon icon={["fas", "user-check"]} className="text-green-600 dark:text-green-400 text-3xl" />
						<h2 className="text-3xl font-bold text-gray-900 dark:text-white">{translate.nav.members}</h2>
					</div>
				</div>
				
				{/* Barra de búsqueda */}
				<div className="mb-6">
					<input
						type="text"
						value={searchTerm}
						onChange={handleSearchChange}
						className="w-full rounded-xl border px-5 py-4 text-lg focus:ring-2 focus:ring-brand-400 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700 shadow-sm"
						placeholder={translate.pages.members.searchPlaceholder}
					/>
				</div>
				
				{/* Filtros */}
				<div className="mb-6 flex flex-wrap gap-3 justify-center">
					<button
						onClick={() => handleFilterChange('all')}
						className={`px-6 py-3 rounded-lg font-semibold transition-all ${
							filter === 'all'
								? 'bg-brand-600 text-white shadow-lg scale-105'
								: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
						}`}
					>
						<FontAwesomeIcon icon={["fas", "users"]} className="mr-2" />
						{translate.pages.members.all} ({totalMembers})
					</button>
					
					<button
						onClick={() => handleFilterChange('members')}
						className={`px-6 py-3 rounded-lg font-semibold transition-all ${
							filter === 'members'
								? 'bg-green-600 text-white shadow-lg scale-105'
								: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
						}`}
					>
						<FontAwesomeIcon icon={["fas", "user-check"]} className="mr-2" />
						{translate.pages.members.members} ({membersCount})
					</button>
					
					<button
						onClick={() => handleFilterChange('non-members')}
						className={`px-6 py-3 rounded-lg font-semibold transition-all ${
							filter === 'non-members'
								? 'bg-orange-600 text-white shadow-lg scale-105'
								: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
						}`}
					>
						<FontAwesomeIcon icon={["fas", "user-xmark"]} className="mr-2" />
						{translate.pages.members.attendees} ({nonMembersCount})
					</button>
				</div>
				
				{/* Estado de carga */}
				{isLoading && (
					<div className="flex justify-center items-center py-12">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
					</div>
				)}
				
				{/* Error */}
				{error && (
					<div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
						<FontAwesomeIcon icon={["fas", "exclamation-triangle"]} className="mr-2" />
						{error}
					</div>
				)}
				
				{/* Lista de miembros */}
				{!isLoading && !error && (
					<>
						{filteredMembers.length === 0 ? (
							<div className="text-center py-12">
								<FontAwesomeIcon 
									icon={["fas", "users-slash"]} 
									className="text-6xl text-gray-400 dark:text-gray-600 mb-4" 
								/>
								<p className="text-xl text-gray-600 dark:text-gray-400">
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
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
								{filteredMembers.map((member) => (
									<UserCard 
										key={member.id}
										user={member}
										showRelation={false}
										showPhone={true}
										showNationality={true}
									/>
								))}
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}
