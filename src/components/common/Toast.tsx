import { Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface ToastProps {
  show: boolean;
  message: string;
}

export function Toast({ show, message }: ToastProps) {
  return (
    <div className="fixed bottom-4 right-4">
      <Transition
        show={show}
        as={Fragment}
        enter="transform ease-out duration-300 transition"
        enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enterTo="translate-y-0 opacity-100 sm:translate-x-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
          <div className="p-4">
            <div className="flex items-center">
              <div className="ml-3 w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {message}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
} 