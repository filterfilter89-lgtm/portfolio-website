with open("src/data/categories.js", "r", encoding="utf-8") as f:
    cat_code = f.read()

cat_code = cat_code.replace(
    "return category.projects.find(p => p.id === projectId) || category.projects[0];",
    "if (!projectId) return null;\n  return category.projects.find(p => p.id === projectId) || null;"
)

with open("src/data/categories.js", "w", encoding="utf-8") as f:
    f.write(cat_code)

print("Updated getProjectById in categories.js")

with open("src/App.jsx", "r", encoding="utf-8") as f:
    app_code = f.read()

app_code = app_code.replace(
    "const currentProject = getProjectById(selectedCategoryId, selectedProjectId);",
    "const currentProject = selectedProjectId ? getProjectById(selectedCategoryId, selectedProjectId) : null;"
)

with open("src/App.jsx", "w", encoding="utf-8") as f:
    f.write(app_code)

print("Updated currentProject in App.jsx")

with open("src/components/ProjectShowcaseView.jsx", "r", encoding="utf-8") as f:
    sc_code = f.read()

sc_code = sc_code.replace(
    "const [activeDossierProject, setActiveDossierProject] = useState(() => initialProject || null);",
    "const [activeDossierProject, setActiveDossierProject] = useState(() => (initialProject && initialProject.id ? initialProject : null));"
)

with open("src/components/ProjectShowcaseView.jsx", "w", encoding="utf-8") as f:
    f.write(sc_code)

print("Updated initial dossier state in ProjectShowcaseView.jsx")
