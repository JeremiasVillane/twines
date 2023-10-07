"use client";

import { emojiList } from "@/constants/emojiPicker";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import React, { useRef, useState } from "react";

interface EmojiSelectorProps {
  onSelect: (emoji: string) => void;
  setShowEmojiSelector: (arg: boolean) => void;
  emojiButtonRef: any;
}

const EmojiSelector: React.FC<EmojiSelectorProps> = ({
  onSelect,
  setShowEmojiSelector,
  emojiButtonRef,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const emojiSelectorRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(emojiSelectorRef, emojiButtonRef, () => setShowEmojiSelector(false));

  return (
    <main
      className="bg-dark-3 rounded-md flex flex-col max-w-xs h-80 border border-[#1f1f22] select-none absolute -translate-y-[55%] -translate-x-[47%] overflow-hidden"
      ref={emojiSelectorRef}
    >
      <section
        id="scrollable-emoji-categories"
        className="bg-dark-3 overflow-x-auto text-light-1 py-2 whitespace-nowrap sticky top-0 flex-shrink-0"
      >
        {emojiList.map((category, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`${"px-2 py-1 mx-1 rounded-md"} ${
              index === activeTab ? "bg-dark-4" : ""
            }`}
          >
            {category.title}
          </button>
        ))}
      </section>

      <section
        id="scrollable-emoji-list"
        className="text-light-2 p-3 overflow-y-auto"
      >
        {emojiList[activeTab].subcategories.map((subcategory, index) => (
          <div key={index} className="text-base-semibold">
            <h2 className="mt-3 mb-2">{subcategory.title}</h2>
            <div className="text-justify">
              {subcategory.emojis.map((emoji, emojiIndex) => (
                <span
                  key={emojiIndex}
                  onClick={() => onSelect(emoji)}
                  className="text-heading4-medium mx-1 cursor-pointer"
                >
                  {emoji}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};

export default EmojiSelector;
