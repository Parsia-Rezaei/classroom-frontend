export const API_URL = "https://api.fake-rest.refine.dev";

type Subject = {
  id: number;
  code: string;
  name: string;
  department: string;
  description: string;
};

export const MOCK_SUBJECTS: Subject[] = [
  {
    id: 1,
    code: "CS101",
    name: "Introduction to Computer Science",
    department: "Computer Science",
    description:
      "An introduction to fundamental concepts of computer science, including algorithms, data structures, programming, and computational thinking.",
  },
  {
    id: 2,
    code: "MATH201",
    name: "Calculus II",
    department: "Mathematics",
    description:
      "A study of integration techniques, infinite series, parametric equations, and applications of calculus in mathematics and science.",
  },
  {
    id: 3,
    code: "ENG205",
    name: "Academic Writing",
    department: "English",
    description:
      "Develops academic writing skills with a focus on research, essay structure, argumentation, citations, and clear scholarly communication.",
  },
];
