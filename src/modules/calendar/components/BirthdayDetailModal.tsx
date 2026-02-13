import Modal from '@/core/components/ui/modal/Modal';
import { calculateBirthdayAge } from '@/core/helpers/dateUtils';

export const BirthdayDetailModal = ({ open, birthday, age, date, onClose }) => {
    if (!birthday) return null;
    const birthdayAge = age ?? calculateBirthdayAge(birthday.birthdate, date);

    // Definir gradiente y color de texto según género
    const genderGradient =
        birthday.gender === "male"
            ? "from-blue-400 via-blue-500 to-blue-700"
            : birthday.gender === "female"
            ? "from-pink-400 via-pink-500 to-pink-700"
            : "from-yellow-400 via-pink-500 to-purple-600"; // fallback

    const genderTextColor =
        birthday.gender === "male"
            ? "text-blue-500"
            : birthday.gender === "female"
            ? "text-pink-500"
            : "text-pink-500"; // fallback

    return (
        <Modal open={open} onClose={onClose} title={"¡Hoy es un día especial!"}>
            <div className="flex flex-col items-center gap-4 p-8 relative overflow-hidden">
                
                {/* 1. Fondo decorativo (Glow) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/20 blur-[80px] rounded-full z-0" />

                {/* 2. Contenedor del Avatar con Anillo de Gradiente */}
                <div className={`relative z-10 p-1 rounded-full bg-gradient-to-tr ${genderGradient} shadow-[0_0_20px_rgba(236,72,153,0.3)]`}>
                    <div className="rounded-full bg-[#1a1c24] p-1"> {/* Espacio negro entre borde y foto */}
                        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/10">
                            <img
                                src={birthday.avatar}
                                alt={birthday.name}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </div>

                    {/* 3. El Span de la Edad (Badge Mejorado) */}
                    {birthdayAge && (
                        <span className="absolute -top-2 -right-3 bg-gradient-to-br from-orange-400 to-orange-600 text-white text-lg font-black rounded-full w-12 h-12 flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.3)] border-2 border-white ring-4 ring-[#1a1c24]">
                            {birthdayAge}
                        </span>
                    )}
                </div>

                {/* 4. Textos */}
                <div className="text-center z-10 space-y-1">
                    <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                        {birthday.name}
                    </h2>
                    
                    {birthdayAge && (
                        <p className={`text-xl font-bold animate-pulse bg-clip-text text-transparent bg-gradient-to-b ${genderGradient}`}>
                            ¡Celebra sus {birthdayAge} años!
                        </p>
                    )}
                    
                    <p className="text-gray-400 max-w-[250px] mx-auto pt-2 text-sm leading-relaxed">
                        Deséale un día increíble lleno de sorpresas.
                    </p>
                </div>
            </div>
        </Modal>
    );
};