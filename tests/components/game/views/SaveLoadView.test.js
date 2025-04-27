import { mount } from "@vue/test-utils";
import SaveLoadView from "@views/SaveLoadView.vue";
import GameState from "@models/GameState.js";

describe("SaveLoadView", () => {
  let wrapper;
  let gameState;

  beforeEach(() => {
    // Create a fresh game state for each test
    gameState = new GameState();
    gameState.money = 1000;
    gameState.currentJob = "developer";
    gameState.jobProgress = 50;
    gameState.currentLearning = "javascript";
    gameState.skillProgress = { javascript: 75 };
    gameState.ownedItems = new Set(["laptop"]);

    wrapper = mount(SaveLoadView, {
      props: {
        gameState,
      },
    });
  });

  describe("Save Game", () => {
    it("should generate a valid encoded string when saving", async () => {
      // Click save button
      await wrapper.find(".save-button").trigger("click");

      // Get the save code
      const saveCode = wrapper.vm.saveCode;

      // Verify the code is not empty
      expect(saveCode).toBeTruthy();

      // Try to decode the save code
      const decodedState = GameState.decode(saveCode);
      expect(decodedState).toBeTruthy();

      // Verify the decoded state matches the original
      expect(decodedState.money).toBe(gameState.money);
      expect(decodedState.currentJob).toBe(gameState.currentJob);
      expect(decodedState.jobProgress).toBe(gameState.jobProgress);
      expect(decodedState.currentLearning).toBe(gameState.currentLearning);
      expect(decodedState.skillProgress).toEqual(gameState.skillProgress);
      expect(Array.from(decodedState.ownedItems)).toEqual(
        Array.from(gameState.ownedItems)
      );
    });

    it("should show success message when saving", async () => {
      await wrapper.find(".save-button").trigger("click");
      expect(wrapper.find(".message").text()).toContain(
        "Game saved successfully!"
      );
    });

    it("should show error message if save fails", async () => {
      // Mock encode to throw error
      const originalEncode = gameState.encode;
      gameState.encode = () => {
        throw new Error("Save failed");
      };

      await wrapper.find(".save-button").trigger("click");
      expect(wrapper.find(".message").text()).toContain("Error saving game");

      // Restore original encode
      gameState.encode = originalEncode;
    });
  });

  describe("Load Game", () => {
    it("should show error for empty save code", async () => {
      await wrapper.find(".load-button").trigger("click");
      expect(wrapper.find(".message").text()).toContain(
        "Please enter a save code!"
      );
    });

    it("should show error for invalid save code", async () => {
      // Set invalid code
      await wrapper.setData({ loadCode: "invalid-code" });
      await wrapper.find(".load-button").trigger("click");
      expect(wrapper.find(".message").text()).toContain("Invalid save code!");
    });

    it("should not modify current state when loading invalid code", async () => {
      const originalState = { ...gameState };

      // Set invalid code and try to load
      await wrapper.setData({ loadCode: "invalid-code" });
      await wrapper.find(".load-button").trigger("click");

      // Verify state hasn't changed
      expect(gameState.money).toBe(originalState.money);
      expect(gameState.currentJob).toBe(originalState.currentJob);
      expect(gameState.jobProgress).toBe(originalState.jobProgress);
      expect(gameState.currentLearning).toBe(originalState.currentLearning);
      expect(gameState.skillProgress).toEqual(originalState.skillProgress);
      expect(Array.from(gameState.ownedItems)).toEqual(
        Array.from(originalState.ownedItems)
      );
    });

    it("should not emit load-game event for invalid code", async () => {
      // Set invalid code and try to load
      await wrapper.setData({ loadCode: "invalid-code" });
      await wrapper.find(".load-button").trigger("click");

      // Verify emit was not called
      expect(wrapper.emitted("load-game")).toBeFalsy();
    });

    it("should handle malformed save code", async () => {
      const originalState = { ...gameState };

      // Set malformed code (valid base64 but invalid game state)
      await wrapper.setData({ loadCode: "SGVsbG8gV29ybGQ=" }); // "Hello World" in base64
      await wrapper.find(".load-button").trigger("click");

      // Verify state hasn't changed
      expect(gameState.money).toBe(originalState.money);
      expect(gameState.currentJob).toBe(originalState.currentJob);
      expect(gameState.jobProgress).toBe(originalState.jobProgress);
      expect(gameState.currentLearning).toBe(originalState.currentLearning);
      expect(gameState.skillProgress).toEqual(originalState.skillProgress);
      expect(Array.from(gameState.ownedItems)).toEqual(
        Array.from(originalState.ownedItems)
      );
    });

    it("should handle decode errors gracefully", async () => {
      const originalState = { ...gameState };

      // Mock decode to throw error
      const originalDecode = GameState.decode;
      GameState.decode = () => {
        throw new Error("Decode failed");
      };

      // Try to load
      await wrapper.setData({ loadCode: "any-code" });
      await wrapper.find(".load-button").trigger("click");

      // Verify state hasn't changed
      expect(gameState.money).toBe(originalState.money);
      expect(gameState.currentJob).toBe(originalState.currentJob);
      expect(gameState.jobProgress).toBe(originalState.jobProgress);
      expect(gameState.currentLearning).toBe(originalState.currentLearning);
      expect(gameState.skillProgress).toEqual(originalState.skillProgress);
      expect(Array.from(gameState.ownedItems)).toEqual(
        Array.from(originalState.ownedItems)
      );

      // Restore original decode
      GameState.decode = originalDecode;
    });

    it("should emit load-game event with decoded state for valid code", async () => {
      // Create a valid save code
      const validCode = gameState.encode();
      await wrapper.setData({ loadCode: validCode });

      // Click load button
      await wrapper.find(".load-button").trigger("click");

      // Verify emit was called with correct data
      const emitted = wrapper.emitted("load-game");
      expect(emitted).toBeTruthy();
      expect(emitted[0]).toBeTruthy();

      // Verify the emitted state matches the original
      const emittedState = emitted[0][0];
      expect(emittedState.money).toBe(gameState.money);
      expect(emittedState.currentJob).toBe(gameState.currentJob);
      expect(emittedState.jobProgress).toBe(gameState.jobProgress);
      expect(emittedState.currentLearning).toBe(gameState.currentLearning);
      expect(emittedState.skillProgress).toEqual(gameState.skillProgress);
      expect(Array.from(emittedState.ownedItems)).toEqual(
        Array.from(gameState.ownedItems)
      );
    });

    it("should show success message when loading valid code", async () => {
      const validCode = gameState.encode();
      await wrapper.setData({ loadCode: validCode });
      await wrapper.find(".load-button").trigger("click");
      expect(wrapper.find(".message").text()).toContain(
        "Game loaded successfully!"
      );
    });
  });

  describe("Copy Code", () => {
    it("should copy save code to clipboard", async () => {
      // Mock clipboard API
      const mockClipboard = {
        writeText: jest.fn(),
      };
      Object.assign(navigator, {
        clipboard: mockClipboard,
      });

      // Generate a save code
      await wrapper.find(".save-button").trigger("click");
      const saveCode = wrapper.vm.saveCode;

      // Click copy button
      await wrapper.find(".copy-button").trigger("click");

      // Verify clipboard was called with correct code
      expect(mockClipboard.writeText).toHaveBeenCalledWith(saveCode);
      expect(wrapper.find(".message").text()).toContain(
        "Code copied to clipboard!"
      );
    });
  });
});
