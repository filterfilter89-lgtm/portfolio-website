with open("src/App.jsx", "r", encoding="utf-8") as f:
    code = f.read()

# 1. Update initial view hash
code = code.replace("if (hash.startsWith('#work/')) return 'category';", "if (hash.startsWith('#work/')) return 'showcase';")

# 2. Add discOrigin state
old_returning_state = "const [isReturningFromCategory, setIsReturningFromCategory] = useState(false);"
new_returning_state = """const [isReturningFromCategory, setIsReturningFromCategory] = useState(false);
  const [discOrigin, setDiscOrigin] = useState(null);"""

if old_returning_state in code and "const [discOrigin" not in code:
    code = code.replace(old_returning_state, new_returning_state, 1)
    print("Added discOrigin state.")

# 3. Update handleSelectCategory and add handleCloseShowcase
old_handlers = """  // Open Category Page (Album goes down, project vinyls pop up)
  const handleSelectCategory = useCallback((categoryId) => {
    setSelectedCategoryId(categoryId);
    setSelectedProjectId(null);
    setIsReturningFromCategory(false);
    setView('category');
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `#work/${categoryId}`);
    }
  }, []);

  // Close Category Page back to Album Carousel
  const handleCloseCategory = useCallback(() => {
    setIsReturningFromCategory(true);
    setSelectedProjectId(null);
    setView('wheel');
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '#work');
    }
  }, []);"""

new_handlers = """  // Open Project Showcase directly when album is clicked
  const handleSelectCategory = useCallback((categoryId, origin) => {
    setSelectedCategoryId(categoryId);
    setSelectedProjectId(null);
    if (origin && typeof origin.x === 'number') {
      setDiscOrigin(origin);
    } else {
      setDiscOrigin(null);
    }
    setIsReturningFromCategory(false);
    setView('showcase');
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `#work/${categoryId}`);
    }
  }, []);

  // Close Project Showcase back to Album Carousel
  const handleCloseShowcase = useCallback(() => {
    setIsReturningFromCategory(true);
    setSelectedProjectId(null);
    setView('wheel');
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '#work');
    }
  }, []);"""

if old_handlers in code:
    code = code.replace(old_handlers, new_handlers, 1)
    print("Updated select/close showcase handlers.")
else:
    print("Could not find exact old_handlers block.")

# 4. Update the JSX view render
old_render = """      {view === 'category' && (
        <CategoryDetailView
          categoryId={selectedCategoryId}
          onBack={handleCloseCategory}
          onSelectProject={handleSelectProject}
        />
      )}

      {view === 'showcase' && currentProject && (
        <ProjectShowcaseView
          project={currentProject}
          category={currentCategory}
          onBack={handleCloseProject}
        />
      )}"""

new_render = """      {(view === 'showcase' || view === 'category') && (
        <ProjectShowcaseView
          category={currentCategory}
          project={currentProject}
          onBack={handleCloseShowcase}
          discOrigin={discOrigin}
        />
      )}"""

if old_render in code:
    code = code.replace(old_render, new_render, 1)
    print("Updated JSX view render block.")
else:
    print("Could not find exact old_render block.")

# 5. Update popstate / hashchange handling
code = code.replace("target === 'category'", "target === 'showcase'")

with open("src/App.jsx", "w", encoding="utf-8") as f:
    f.write(code)

print("src/App.jsx updated.")
