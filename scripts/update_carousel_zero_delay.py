with open("src/components/AlbumCarousel.jsx", "r", encoding="utf-8") as f:
    code = f.read()

old_trigger = """  // Trigger smooth descent before unmounting carousel
  const triggerSelectCategory = useCallback((slot, categoryId, origin) => {
    if (isDescending) return;
    setIsDescending(true);
    setDescendingSlot(slot);

    setTimeout(() => {
      if (onSelectCategory) {
        onSelectCategory(categoryId, origin);
      }
    }, 440);
  }, [isDescending, onSelectCategory]);"""

new_trigger = """  // Trigger immediate vinyl slide & showcase transition with zero delay
  const triggerSelectCategory = useCallback((slot, categoryId, origin) => {
    if (isDescending) return;
    setIsDescending(true);
    setDescendingSlot(slot);

    // Immediate invocation - no delay
    if (onSelectCategory) {
      onSelectCategory(categoryId, origin);
    }
  }, [isDescending, onSelectCategory]);"""

if old_trigger in code:
    code = code.replace(old_trigger, new_trigger, 1)
    with open("src/components/AlbumCarousel.jsx", "w", encoding="utf-8") as f:
        f.write(code)
    print("AlbumCarousel.jsx updated: 0ms delay on select!")
else:
    print("Could not find exact old_trigger in AlbumCarousel.jsx")
