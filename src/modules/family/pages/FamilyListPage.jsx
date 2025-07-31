import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FamilyMemberModal from "./FamilyMemberModal";
import FamilyMemberCard from "./FamilyMemberCard";
import { useModal } from "../../../hooks/useModal";

const initialFamilyMembers = [
  {
    id: 1,
    name: "Carlos Pérez",
    relation: "Padre",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    age: 45,
    type: "Miembro",
    email: "carlos.perez@email.com",
    birthdate: "1980-03-15",
    phone: "+58 412-1234567"
  },
  {
    id: 2,
    name: "Lucía Fernández",
    relation: "Madre",
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
    age: 43,
    type: "Miembro",
    email: "lucia.fernandez@email.com",
    birthdate: "1982-07-22",
    phone: "+58 414-7654321"
  },
  {
    id: 3,
    name: "Javier Morales",
    relation: "Hijo",
    avatar: "https://randomuser.me/api/portraits/men/7.jpg",
    age: 18,
    type: "Asistente",
    email: "javier.morales@email.com",
    birthdate: "2007-01-10",
    phone: "+58 424-1112233"
  },
  {
    id: 4,
    name: "Marta Iglesias",
    relation: "Hija",
    avatar: "https://randomuser.me/api/portraits/women/42.jpg",
    age: 15,
    type: "Asistente",
    email: "marta.iglesias@email.com",
    birthdate: "2010-11-05",
    phone: "+58 426-3344556"
  },
  {
    id: 5,
    name: "Samuel Duarte",
    relation: "Hermano",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    age: 20,
    type: "Miembro",
    email: "samuel.duarte@email.com",
    birthdate: "2005-05-30",
    phone: "+58 412-9988776"
  }
];

export default function FamilyListPage() {
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState(initialFamilyMembers);
  const { isOpen, openModal, closeModal } = useModal();

  const filteredMembers = members.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.relation.toLowerCase().includes(search.toLowerCase()));

  const handleAddMember = (member) => {
    setMembers(prev => [...prev, {
      ...member,
    }]);
  };

  return (
    <div className="relative min-h-[80vh] dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="p-4 md:p-6">
        <h2 className="text-4xl font-extrabold mb-8 text-black dark:text-white text-center drop-shadow">
          <FontAwesomeIcon icon={["fas", "users"]} className="text-blue-700 px-3" />
          Mi Familia
        </h2>
        <input
          className="mb-10 w-full rounded-xl border px-5 py-4 text-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700 shadow-sm"
          placeholder="Buscar miembro, relación..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-6 md:gap-8 lg:gap-10">
          {filteredMembers.map(member => (
            <FamilyMemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
      {/* Botón flotante para agregar */}
      <button
        className="fixed bottom-15 right-2 z-5 bg-blue-400 hover:bg-blue-700 text-white rounded-full w-20 h-20 flex items-center justify-center shadow-2xl transition-all text-4xl dark:border-gray-900 hover:scale-110 hover:rotate-6 opacity-60 hover:opacity-100"
        title="Agregar miembro de la familia"
        onClick={openModal}
      >
        <FontAwesomeIcon icon={["fas", "plus"]} />
      </button>
      {/* Modal para crear nuevo integrante */}
      <FamilyMemberModal isOpen={isOpen} onClose={closeModal} onAdd={handleAddMember} />
    </div>
  );
}