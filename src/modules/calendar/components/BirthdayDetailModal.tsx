import Modal from '@/core/components/ui/modal/Modal';
import { calculateBirthdayAge } from '@/core/helpers/dateUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const BirthdayDetailModal = ({ open, birthday, age, date, onClose }) => {
    if (!birthday) return null;
    const birthdayAge = age ?? calculateBirthdayAge(birthday.birthdate, date);

    // Gradientes y fondos para light/dark
    const isDark = document.documentElement.classList.contains('dark');
    const bgGradient = isDark
        ? 'bg-gradient-to-br from-[#23243a] via-[#1a1c24] to-[#23243a]'
        : 'bg-gradient-to-br from-[#fff7f0] via-[#f3f4f6] to-[#fff7f0]';
    const ringColor = isDark ? 'ring-[#1a1c24]' : 'ring-[#fff]';
    const cardBg = isDark ? 'bg-[#23243a]' : 'bg-white';
    const textMain = isDark ? 'text-white' : 'text-gray-800';
    const textSub = isDark ? 'text-gray-300' : 'text-gray-600';

    // Gradiente de avatar según género
    const genderGradient =
        birthday.gender === "male"
            ? "from-blue-400 via-blue-500 to-blue-700"
            : birthday.gender === "female"
            ? "from-pink-400 via-pink-500 to-pink-700"
            : "from-yellow-400 via-pink-500 to-purple-600";

    // Mensaje cálido para iglesia
    const blessing = `¡Dios te bendiga en tu cumpleaños número ${birthdayAge || ''}!`;
    const subtitle = `Acompáña con tus oraciones y buenos deseos en este día especial.`;

    return (
        <Modal open={open} onClose={onClose} title="Feliz cumpleaños">
            <div className={`flex flex-col items-center gap-4 p-8 relative overflow-hidden rounded-2xl transition-all duration-300`}> 

                {/* Avatar con halo */}
                <div className={`relative z-10 p-1 rounded-full bg-gradient-to-tr ${genderGradient} shadow-[0_0_20px_rgba(236,72,153,0.3)]`}>
                    <div className={`rounded-full ${cardBg} p-1`}>
                        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/10">
                            <img
                                src={birthday.avatar}
                                alt={birthday.name}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </div>
                    {/* Badge de edad */}
                    {birthdayAge && (
                        <span className={`absolute -top-2 -right-3 bg-gradient-to-br from-orange-400 to-orange-600 text-white text-lg font-black rounded-full w-12 h-12 flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.3)] border-2 border-white ring-4 ${ringColor}`}>
                            {birthdayAge}
                        </span>
                    )}
                </div>

                {/* Textos */}
                <div className="text-center z-10 space-y-1">
                    <h2 className={`text-3xl font-extrabold ${textMain}`}>{birthday.name}</h2>
                    {birthdayAge && (
                        <p className={`text-lg font-bold animate-pulse bg-clip-text text-transparent bg-gradient-to-b ${genderGradient}`}>
                            {blessing}
                        </p>
                    )}
                    <p className={`max-w-[300px] mx-auto pt-2 text-base leading-relaxed ${textSub}`}>
                        {subtitle}
                    </p>
                </div>
            </div>
        </Modal>
    );
};