import { useTheme } from "../context/ThemeProvider";

function ThemeContent() {
  const { isDark } = useTheme();

  return (
    <p className={isDark ? "text-white" : "text-black"}>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. <br/>
      Molestiae aut amet ex distinctio fugit, nihil dolorem doloremque fuga odio facere explicabo asperiores sed voluptatem nulla dolore! Earum similique cumque unde.
    </p>
  );
}

export default ThemeContent;
