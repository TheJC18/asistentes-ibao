import { Spinner } from 'flowbite-react';

export const ChekingAuth = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-surface">
      <Spinner aria-label="Verificando si el usuario esta logeado" color='info' className="!w-32 !h-32"/>
    </div>
  );
};
