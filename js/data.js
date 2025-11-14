// Book data management module
class BookData {
  constructor() {
    this.data = {
      title: "My Novel",
      codex: {
        categories: ['Character', 'Locals', 'Plots', 'Object', 'Lore', 'Other'],
        entries: [
          {
            id: 1,
            name: "Elena Blackwood",
            category: "Character",
            description: "The protagonist. A skilled detective with a mysterious past. Known for her sharp wit and unorthodox methods.",
            tags: ["protagonist", "detective", "mystery"]
          },
          {
            id: 2,
            name: "Marcus Stone",
            category: "Character",
            description: "Elena's mentor and former partner. A wise veteran detective who taught her everything she knows.",
            tags: ["mentor", "wisdom", "guidance"]
          },
          {
            id: 3,
            name: "The Shadow Syndicate",
            category: "Plots",
            description: "A mysterious criminal organization that operates in the city's underbelly. Their true motives remain unknown.",
            tags: ["betrayal", "conflict", "mystery", "drama"]
          },
          {
            id: 4,
            name: "The Ancient Amulet",
            category: "Object",
            description: "A mystical artifact that holds the key to great power. Many seek to possess it.",
            tags: ["mystery", "plot-point", "discovery"]
          },
          {
            id: 5,
            name: "Riverside District",
            category: "Locals",
            description: "The old industrial area of the city. Now mostly abandoned, it serves as a meeting place for shady dealings.",
            tags: ["action", "battle", "conflict"]
          },
          {
            id: 6,
            name: "Sarah Chen",
            category: "Character",
            description: "A tech-savvy ally who helps Elena with digital investigations. Loyal and resourceful.",
            tags: ["character", "friendship", "teamwork"]
          },
          {
            id: 7,
            name: "The Night of Betrayal",
            category: "Lore",
            description: "A legendary event from the past that set everything in motion. Few know the true story.",
            tags: ["betrayal", "loss", "emotional", "foreshadowing"]
          },
          {
            id: 8,
            name: "The Crimson Key",
            category: "Object",
            description: "A mysterious key that opens a secret vault. Its location has been lost for decades.",
            tags: ["mystery", "discovery", "plot-point"]
          },
          {
            id: 9,
            name: "Victor Blackwood",
            category: "Character",
            description: "Elena's estranged father. His disappearance years ago is shrouded in mystery.",
            tags: ["mystery", "emotional", "foreshadowing"]
          },
          {
            id: 10,
            name: "The Grand Library",
            category: "Locals",
            description: "An ancient library that holds forbidden knowledge. Access is restricted to a select few.",
            tags: ["wisdom", "knowledge", "discovery"]
          }
        ]
      },
      acts: [
        {
          id: 1,
          title: "Act I: The Beginning",
          chapters: [
            {
              id: 1,
              title: "The Awakening",
              numbering: true,
              visibleInFinal: true,
              sections: [
                {
                  id: 1,
                  title: "Morning Light",
                  summary: "The protagonist wakes up to discover their ordinary world has changed overnight.",
                  content: "Full content would go here...",
                  tags: ["action", "morning", "discovery"]
                },
                {
                  id: 2,
                  title: "First Signs",
                  summary: "Strange occurrences begin to manifest, hinting at the adventure to come.",
                  content: "Full content would go here...",
                  tags: ["mystery", "foreshadowing"]
                },
                {
                  id: 3,
                  title: "The Call",
                  summary: "A mysterious message arrives that will change everything.",
                  content: "Full content would go here...",
                  tags: ["plot-point", "mystery", "turning-point"]
                }
              ]
            },
            {
              id: 2,
              title: "Crossing the Threshold",
              numbering: true,
              visibleInFinal: true,
              sections: [
                {
                  id: 1,
                  title: "The Decision",
                  summary: "After much deliberation, the protagonist decides to embark on the journey.",
                  content: "Full content would go here...",
                  tags: ["decision", "character-growth"]
                },
                {
                  id: 2,
                  title: "Leaving Home",
                  summary: "Emotional farewell to the familiar world and loved ones.",
                  content: "Full content would go here...",
                  tags: ["emotional", "farewell", "departure"]
                }
              ]
            }
          ]
        },
        {
          id: 2,
          title: "Act II: Rising Action",
          chapters: [
            {
              id: 3,
              title: "Trials and Tribulations",
              numbering: true,
              visibleInFinal: true,
              sections: [
                {
                  id: 1,
                  title: "First Challenge",
                  summary: "The protagonist faces their first major obstacle and learns valuable lessons.",
                  content: "Full content would go here...",
                  tags: ["action", "challenge", "growth"]
                },
                {
                  id: 2,
                  title: "Meeting Allies",
                  summary: "New companions join the journey, each bringing unique skills and perspectives.",
                  content: "Full content would go here...",
                  tags: ["character", "friendship", "teamwork"]
                },
                {
                  id: 3,
                  title: "The Mentor's Wisdom",
                  summary: "A wise mentor appears to guide the protagonist through difficult times.",
                  content: "Full content would go here...",
                  tags: ["wisdom", "mentor", "guidance"]
                }
              ]
            },
            {
              id: 4,
              title: "The Dark Night",
              numbering: true,
              visibleInFinal: true,
              sections: [
                {
                  id: 1,
                  title: "Betrayal",
                  summary: "A trusted ally reveals their true colors, causing chaos and doubt.",
                  content: "Full content would go here...",
                  tags: ["betrayal", "conflict", "drama"]
                },
                {
                  id: 2,
                  title: "Loss",
                  summary: "Something precious is lost, pushing the protagonist to their lowest point.",
                  content: "Full content would go here...",
                  tags: ["emotional", "loss", "low-point"]
                }
              ]
            }
          ]
        },
        {
          id: 3,
          title: "Act III: Resolution",
          chapters: [
            {
              id: 5,
              title: "The Final Confrontation",
              numbering: true,
              visibleInFinal: true,
              sections: [
                {
                  id: 1,
                  title: "Gathering Strength",
                  summary: "The protagonist rallies their remaining allies for one last stand.",
                  content: "Full content would go here...",
                  tags: ["preparation", "teamwork", "hope"]
                },
                {
                  id: 2,
                  title: "The Battle",
                  summary: "An epic confrontation with the antagonist where everything is at stake.",
                  content: "Full content would go here...",
                  tags: ["action", "climax", "epic", "battle"]
                },
                {
                  id: 3,
                  title: "Victory",
                  summary: "Through courage and sacrifice, the protagonist prevails against all odds.",
                  content: "Full content would go here...",
                  tags: ["victory", "sacrifice", "resolution"]
                }
              ]
            },
            {
              id: 6,
              title: "A New Beginning",
              numbering: true,
              visibleInFinal: true,
              sections: [
                {
                  id: 1,
                  title: "Aftermath",
                  summary: "The world begins to heal and rebuild after the conflict.",
                  content: "Full content would go here...",
                  tags: ["healing", "peace", "recovery"]
                },
                {
                  id: 2,
                  title: "Return Home",
                  summary: "The protagonist returns transformed, bringing wisdom and hope to their world.",
                  content: "Full content would go here...",
                  tags: ["ending", "transformation", "homecoming"]
                }
              ]
            }
          ]
        }
      ]
    };
  }

  // Get the entire book data
  getBook() {
    return this.data;
  }

  // Find an act by ID
  findAct(actId) {
    return this.data.acts.find(a => a.id === actId);
  }

  // Find a chapter by act and chapter ID
  findChapter(actId, chapterId) {
    const act = this.findAct(actId);
    if (!act || !act.chapters) return null;
    return act.chapters.find(c => c.id === chapterId);
  }

  // Find a section
  findSection(actId, chapterId, sectionId) {
    const chapter = this.findChapter(actId, chapterId);
    if (!chapter || !chapter.sections) return null;
    return chapter.sections.find(s => s.id === sectionId);
  }

  // Add a new act
  addAct(title) {
    const newId = Math.max(...this.data.acts.map(a => a.id), 0) + 1;
    const newAct = {
      id: newId,
      title: title,
      chapters: []
    };
    this.data.acts.push(newAct);
    return newAct;
  }

  // Add a new chapter to an act
  addChapter(actId, title) {
    const act = this.findAct(actId);
    if (!act) return null;

    const allChapterIds = this.data.acts.flatMap(a =>
      (a.chapters || []).map(c => c.id)
    );
    const newId = Math.max(...allChapterIds, 0) + 1;

    const newChapter = {
      id: newId,
      title: title,
      numbering: true,
      visibleInFinal: true,
      sections: []
    };

    if (!act.chapters) {
      act.chapters = [];
    }
    act.chapters.push(newChapter);
    return newChapter;
  }

  // Update chapter properties
  updateChapter(actId, chapterId, properties) {
    const chapter = this.findChapter(actId, chapterId);
    if (!chapter) return false;

    Object.assign(chapter, properties);
    return true;
  }

  // Delete a chapter
  deleteChapter(actId, chapterId) {
    const act = this.findAct(actId);
    if (!act || !act.chapters) return false;

    const index = act.chapters.findIndex(c => c.id === chapterId);
    if (index === -1) return false;

    act.chapters.splice(index, 1);
    return true;
  }

  // Move a chapter within or between acts
  moveChapter(fromActId, chapterId, toActId, targetIndex) {
    const fromAct = this.findAct(fromActId);
    const toAct = this.findAct(toActId);

    if (!fromAct || !toAct) return false;

    const chapterIndex = fromAct.chapters.findIndex(c => c.id === chapterId);
    if (chapterIndex === -1) return false;

    const [chapter] = fromAct.chapters.splice(chapterIndex, 1);

    if (!toAct.chapters) {
      toAct.chapters = [];
    }
    toAct.chapters.splice(targetIndex, 0, chapter);

    return true;
  }

  // Update act title
  updateActTitle(actId, title) {
    const act = this.findAct(actId);
    if (!act) return false;

    act.title = title;
    return true;
  }
}

// Export singleton instance
const bookData = new BookData();
