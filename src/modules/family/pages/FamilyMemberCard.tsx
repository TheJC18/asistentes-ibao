import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getRelationLabel } from '../../../helpers';

interface FamilyMemberCardProps {
  member: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    birthdate: string;
    age: number | string;
    phone: string;
    type: string;
    relation: string;
    gender?: string;
  };
}

export default function FamilyMemberCard({ member }: FamilyMemberCardProps) {
  console.log(member);

  // Obtener el label de la relación según el género del miembro
  const relationLabel = getRelationLabel(member.relation, member.gender || 'neutral');
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-600 dark:bg-gray-800 md:p-6 flex flex-col gap-4 md:gap-6 hover:scale-[1.03] hover:shadow-3xl dark:hover:shadow-gray-900/50 transition min-h-[340px] h-auto w-full relative group break-words">
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-2 w-full">
        <img src={member.avatar} alt={member.name} className="w-28 h-28 md:w-24 md:h-24 rounded-full object-cover border-3 border-blue-400 shadow-lg flex-shrink-0" />
        <div className="flex-1 w-full min-w-0 flex flex-col items-center md:items-start mt-3 md:mt-0">
          <span className="font-extrabold text-xl md:text-2xl block text-black dark:text-white whitespace-normal break-words" style={{wordBreak: 'break-word'}} title={member.name}>{member.name}</span>
          <span className="text-sm md:text-base text-gray-700 dark:text-gray-200 flex flex-wrap items-center gap-2 mt-1 whitespace-normal break-words" style={{wordBreak: 'break-word'}} title={relationLabel}>
            <FontAwesomeIcon icon={["fas", "users"]} className="text-blue-400" /> {relationLabel}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2 text-sm md:text-base mt-2 w-full text-gray-700 dark:text-gray-200">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <FontAwesomeIcon icon={["fas", member.type === 'Miembro' ? 'user-check' : 'user-friends']} className="text-blue-400" />
          <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-xs ml-1 font-semibold whitespace-normal break-words" style={{wordBreak: 'break-word'}} title={member.type}>{member.type}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <FontAwesomeIcon icon={["fas", "envelope"]} className="text-blue-400" />
          <span className="font-semibold text-black dark:text-white whitespace-normal break-words">Correo:</span> <span className="ml-1 whitespace-normal break-words" style={{wordBreak: 'break-word'}} title={member.email}>{member.email}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <FontAwesomeIcon icon={["fas", "birthday-cake"]} className="text-blue-400" />
          <span className="font-semibold text-black dark:text-white whitespace-normal break-words">Nacimiento:</span> <span className="ml-1 whitespace-normal break-words" style={{wordBreak: 'break-word'}} title={member.birthdate}>{member.birthdate}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <FontAwesomeIcon icon={["fas", "user"]} className="text-blue-400" />
          <span className="font-semibold text-black dark:text-white whitespace-normal break-words">Edad:</span> <span className="ml-1 whitespace-normal break-words" style={{wordBreak: 'break-word'}} title={String(member.age)}>{member.age}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 min-w-0">
         <FontAwesomeIcon icon={["fas", "phone"]} className="text-blue-400" />
          <span className="font-semibold text-black dark:text-white whitespace-normal break-words">Teléfono:</span> <span className="ml-1 whitespace-normal break-words" style={{wordBreak: 'break-word'}} title={member.phone}>{member.phone}</span>
        </div>
      </div>
    </div>
  );
}
