import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function AttendeesListPage() {
	return (
		<div className="relative min-h-[80vh] dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
			<div className="p-4 md:p-6">
				<h2 className="text-4xl font-extrabold mb-8 text-black dark:text-white text-center drop-shadow">
					<FontAwesomeIcon icon={["fas", "users-rectangle"]} className="text-blue-700 px-3" />
					Asistentes
				</h2>
				<input
					className="mb-10 w-full rounded-xl border px-5 py-4 text-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700 shadow-sm"
					placeholder="Buscar asistentes..."
				/>
			</div>
		</div>
	);
}