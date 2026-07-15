/**
 * Small, framework-free copies of the type unions the frontend needs from
 * the backend's Mongoose models (models/User.ts etc. now live only in
 * amakuru-backend — the frontend has no business depending on Mongoose).
 * Keep these in sync with the backend's models by hand; they're plain
 * string unions so drift is easy to catch (TS will flag mismatched values
 * anywhere they're used).
 */
export type UserRole = "Admin" | "Editor" | "Author" | "Moderator" | "Subscriber";
export type SupportedLanguage = "en" | "fr" | "rn";
