import { useSelector } from 'react-redux';
import Calendar from '../../../components/ui/calendar/Calendar';
import CompleteProfileCard from '../components/CompleteProfileCard';

export default function Home() {
  const { profileCompleted } = useSelector((state) => state.auth);

  const handleDateClick = (date) => {
    console.log('Fecha clickeada:', date);
  };

  const handleEventClick = (event) => {
    console.log('Evento clickeado:', event);
  };

  // Si el perfil no está completado, mostrar solo el card de completar perfil
  if (profileCompleted === false) {
    return (
      <div className="p-6">
        <CompleteProfileCard />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Inicio
      </h1>
      
      <Calendar 
        events={[]}
        onDateClick={handleDateClick}
        onEventClick={handleEventClick}
      />
    </div>
  );
}