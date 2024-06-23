import "./Footer.css";

const Footer = () => {
  const today = new Date();
  return (
      <footer className='Footer'>
          <p>Copyright &copy; {today.getFullYear()} CodeCraft</p>
      </footer>
  )
}

export default Footer