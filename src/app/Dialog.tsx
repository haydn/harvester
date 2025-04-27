import { useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  render: (closeDialog: () => void) => ReactNode;
};

const Dialog = ({ children, render }: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [content, setContent] = useState<ReactNode>(null);
  return (
    <div>
      <button
        onClick={() => {
          if (dialogRef.current) {
            dialogRef.current.showModal();
            setContent(
              render(() => {
                if (dialogRef.current) dialogRef.current.close();
              }),
            );
          }
        }}
      >
        {children}
      </button>
      <dialog
        ref={dialogRef}
        onClose={(event) => {
          event.preventDefault();
          setContent(null);
        }}
      >
        <button
          onClick={() => {
            if (dialogRef.current) dialogRef.current.close();
          }}
        >
          Close
        </button>
        {content}
      </dialog>
    </div>
  );
};

export default Dialog;
