// Kristov ***************************
import { CEL1922 } from "../config.js"

const { HandlebarsApplicationMixin } = foundry.applications.api
const { AbstractSidebarTab } = foundry.applications.sidebar

// Kristov ************************************
CEL1922.CEL1922SidebarMenu = CEL1922SidebarMenu

export default class CEL1922SidebarMenu extends HandlebarsApplicationMixin(AbstractSidebarTab) {
  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    window: {
      title: "CEL1922.Sidebar.title",
    },
    actions: {
      openApp: CEL1922SidebarMenu.#onOpenApp,
    },
  }

  /** @override */
  static tabName = "celestopol1922"

  /** @override */
  static PARTS = {
    celestopol1922: {
      template: "systems/celestopol1922/templates/appli/sidebar-menu.html",
      root: true, // Permet d'avoir plusieurs sections dans le html
    },
  }


  static async #onOpenApp(event) {
    switch (event.target.dataset.app) {
      case "reserve":
        if (!foundry.applications.instances.has("celestopol1922-factions")) CEL1922.celestopol1922Factions.render({ force: true })
        // if (!foundry.applications.instances.has("celestopol1922-factions")) game.system.celestopol1922Factions.render({ force: true })
        break
      default:
        break
    }
  }


  /** @inheritDoc */
  async _prepareContext(options) {
    const context = await super._prepareContext(options)
    return Object.assign(context, {
      version: `Version ${game.system.version}`,
    })
  }

}
