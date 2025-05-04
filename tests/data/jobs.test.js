import { jobs } from "@data/jobs";
import { skills } from "@data/skills";

describe("Jobs Data Validation", () => {
  // Test that all jobs have required fields
  test("all jobs have required fields", () => {
    Object.values(jobs).forEach((job) => {
      expect(job).toHaveProperty("id");
      expect(job).toHaveProperty("name");
      expect(job).toHaveProperty("description");
      expect(job).toHaveProperty("category");
      expect(job).toHaveProperty("salary");
      expect(job).toHaveProperty("requiredSkills");
      expect(job).toHaveProperty("requiredJobs");
      expect(job).toHaveProperty("timeRequired");
    });
  });

  // Test that all required skills exist
  test("all required skills exist", () => {
    Object.values(jobs).forEach((job) => {
      job.requiredSkills.forEach((skillId) => {
        expect(skills[skillId]).toBeDefined();
      });
    });
  });

  // Test that all required jobs exist
  test("all required jobs exist", () => {
    Object.values(jobs).forEach((job) => {
      job.requiredJobs.forEach((jobId) => {
        expect(jobs[jobId]).toBeDefined();
      });
    });
  });

  // Test that all jobs have unique IDs
  test("all jobs have unique IDs", () => {
    const ids = Object.values(jobs).map((job) => job.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });

  // Test that each category is used by at least two jobs
  test("each category is used by at least two jobs", () => {
    const categoryUsage = {};
    Object.values(jobs).forEach((job) => {
      categoryUsage[job.category] = (categoryUsage[job.category] || 0) + 1;
    });

    Object.entries(categoryUsage).forEach(([, count]) => {
      expect(count).toBeGreaterThanOrEqual(2);
    });
  });

  // Test that all jobs have positive salary and time required
  test("all jobs have positive salary and time required", () => {
    Object.values(jobs).forEach((job) => {
      expect(job.salary).toBeGreaterThan(0);
      expect(job.timeRequired).toBeGreaterThan(0);
    });
  });

  // Test that prerequisites don't create circular dependencies
  test("no circular dependencies in required jobs", () => {
    const visited = new Set();
    const recursionStack = new Set();

    function hasCycle(jobId) {
      if (!visited.has(jobId)) {
        visited.add(jobId);
        recursionStack.add(jobId);

        const job = jobs[jobId];
        for (const reqJobId of job.requiredJobs) {
          if (!visited.has(reqJobId) && hasCycle(reqJobId)) {
            return true;
          } else if (recursionStack.has(reqJobId)) {
            return true;
          }
        }
      }
      recursionStack.delete(jobId);
      return false;
    }

    Object.keys(jobs).forEach((jobId) => {
      expect(hasCycle(jobId)).toBe(false);
    });
  });

  // Test that all jobs are reachable from starting job
  test("all jobs are reachable from starting job", () => {
    const startingJob = Object.values(jobs).find(
      (job) => job.requiredJobs.length === 0
    );
    expect(startingJob).toBeDefined();

    const reachable = new Set([startingJob.id]);

    function markReachable(jobId) {
      if (reachable.has(jobId)) return;
      reachable.add(jobId);
      const job = jobs[jobId];
      job.requiredJobs.forEach(markReachable);
    }

    Object.keys(jobs).forEach(markReachable);
    expect(reachable.size).toBe(Object.keys(jobs).length);
  });

  // Test that job progression makes sense (salary increases)
  test("job progression has increasing salaries", () => {
    Object.values(jobs).forEach((job) => {
      job.requiredJobs.forEach((reqJobId) => {
        const reqJob = jobs[reqJobId];
        expect(job.salary).toBeGreaterThan(reqJob.salary);
      });
    });
  });
});
