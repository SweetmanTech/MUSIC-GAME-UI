const Button = ({ children, onClick, disabled = false }: any) => (
  <button
    type="button"
    onClick={onClick}
    className="bg-white text-black py-5 px-[80px] rounded-full hover:bg-opacity-80 max-h-20"
    disabled={disabled}
  >
    {children}
  </button>
)

export default Button
