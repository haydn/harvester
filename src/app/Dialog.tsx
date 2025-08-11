import { type ReactNode, useRef, useState } from "react";

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
        type="button"
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
          type="button"
        >
          Close
        </button>
        {content}
      </dialog>
    </div>
  );
};

export default Dialog;
