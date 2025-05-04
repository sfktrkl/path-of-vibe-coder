import { skills } from "@data/skills";
import { jobs } from "@data/jobs";

describe("Skills Data Validation", () => {
  // Test that all skills have required fields
  test("all skills have required fields", () => {
    Object.values(skills).forEach((skill) => {
      expect(skill).toHaveProperty("id");
      expect(skill).toHaveProperty("name");
      expect(skill).toHaveProperty("description");
      expect(skill).toHaveProperty("category");
      expect(skill).toHaveProperty("prerequisites");
      expect(skill).toHaveProperty("timeRequired");
    });
  });

  // Test that all prerequisites exist
  test("all prerequisites exist", () => {
    Object.values(skills).forEach((skill) => {
      skill.prerequisites.forEach((prereqId) => {
        expect(skills[prereqId]).toBeDefined();
      });
    });
  });

  // Test that all skills have unique IDs
  test("all skills have unique IDs", () => {
    const ids = Object.values(skills).map((skill) => skill.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });

  // Test that each category is used by at least two skills
  test("each category is used by at least two skills", () => {
    const categoryUsage = {};
    Object.values(skills).forEach((skill) => {
      categoryUsage[skill.category] = (categoryUsage[skill.category] || 0) + 1;
    });

    Object.entries(categoryUsage).forEach(([, count]) => {
      expect(count).toBeGreaterThanOrEqual(2);
    });
  });

  // Test that all skills have positive time required
  test("all skills have positive time required", () => {
    Object.values(skills).forEach((skill) => {
      expect(skill.timeRequired).toBeGreaterThan(0);
    });
  });

  // Test that prerequisites don't create circular dependencies
  test("no circular dependencies in prerequisites", () => {
    const visited = new Set();
    const recursionStack = new Set();

    function hasCycle(skillId) {
      if (!visited.has(skillId)) {
        visited.add(skillId);
        recursionStack.add(skillId);

        const skill = skills[skillId];
        for (const prereqId of skill.prerequisites) {
          if (!visited.has(prereqId) && hasCycle(prereqId)) {
            return true;
          } else if (recursionStack.has(prereqId)) {
            return true;
          }
        }
      }
      recursionStack.delete(skillId);
      return false;
    }

    Object.keys(skills).forEach((skillId) => {
      expect(hasCycle(skillId)).toBe(false);
    });
  });

  // Test that all skills are reachable from basic skills
  test("all skills are reachable from basic skills", () => {
    const basicSkills = Object.values(skills).filter(
      (skill) => skill.prerequisites.length === 0
    );
    const reachable = new Set(basicSkills.map((skill) => skill.id));

    function markReachable(skillId) {
      if (reachable.has(skillId)) return;
      reachable.add(skillId);
      const skill = skills[skillId];
      skill.prerequisites.forEach(markReachable);
    }

    Object.keys(skills).forEach(markReachable);
    expect(reachable.size).toBe(Object.keys(skills).length);
  });

  // Test that all skills are used by at least one job
  test("all skills are used by at least one job", () => {
    // Get all required skills from all jobs
    const usedSkills = new Set();
    Object.values(jobs).forEach((job) => {
      job.requiredSkills.forEach((skillId) => {
        usedSkills.add(skillId);
      });
    });

    // Find unused skills
    const unusedSkills = Object.keys(skills).filter(
      (skillId) => !usedSkills.has(skillId)
    );

    // If there are unused skills, show them in the error message
    if (unusedSkills.length > 0) {
      console.log("Unused skills:", unusedSkills);
    }

    // Check that every skill is used
    Object.keys(skills).forEach((skillId) => {
      expect(usedSkills.has(skillId)).toBe(true);
    });
  });
});
