export const translateAuthError = (msg: string): string => {
  if (msg.includes("Invalid login credentials")) return "Email ou mot de passe incorrect.";
  if (msg.includes("Email not confirmed")) return "Veuillez confirmer votre email avant de vous connecter.";
  if (msg.includes("User already registered")) return "Un compte existe déjà avec cet email.";
  if (msg.includes("Password should be at least")) return "Le mot de passe doit contenir au moins 6 caractères.";
  if (msg.includes("Unable to validate email address")) return "Adresse email invalide.";
  if (msg.includes("Email rate limit exceeded")) return "Trop de tentatives. Attendez quelques minutes.";
  if (msg.includes("Invalid email")) return "Adresse email invalide.";
  return "Erreur de connexion. Réessayez.";
};
