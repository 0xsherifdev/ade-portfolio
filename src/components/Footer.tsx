interface FooterProps {
  text?: string
}

const Footer = ({ text = 'Designed & Built by Ade © 2025' }: FooterProps) => {
  return (
    <footer className="p-12 text-center border-t border-border">
      <p className="font-mono text-xs text-text-muted">{text}</p>
    </footer>
  );
};

export default Footer;
