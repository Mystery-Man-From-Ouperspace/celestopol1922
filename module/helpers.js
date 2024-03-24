import { CEL1922 } from "./config.js";

export function registerHandlebarsHelpers() {
  Handlebars.registerHelper("getMagicBackground", function (magic) {
    return game.i18n.localize(CEL1922.MAGICS[magic].background);
  });

  Handlebars.registerHelper("getMagicLabel", function (magic) {
    return game.i18n.localize(CEL1922.MAGICS[magic].label);
  });

  Handlebars.registerHelper("getMagicAspectLabel", function (magic) {
    return game.i18n.localize(CEL1922.MAGICS[magic].aspectlabel);
  });

  Handlebars.registerHelper("getMagicSpecialityLabel", function (magic, speciality) {
    return game.i18n.localize(CEL1922.MAGICS[magic].speciality[speciality].label);
  });

  Handlebars.registerHelper("getMagicSpecialityClassIcon", function (magic, speciality) {
    return CEL1922.MAGICS[magic].speciality[speciality].classicon;
  });

  Handlebars.registerHelper("getMagicSpecialityIcon", function (magic, speciality) {
    return CEL1922.MAGICS[magic].speciality[speciality].icon;
  });

  Handlebars.registerHelper("getMagicSpecialityElementIcon", function (magic, speciality) {
    return CEL1922.MAGICS[magic].speciality[speciality].elementicon;
  });

  Handlebars.registerHelper("getMagicSpecialityLabelIcon", function (magic, speciality) {
    return CEL1922.MAGICS[magic].speciality[speciality].labelicon;
  });

  Handlebars.registerHelper("getMagicSpecialityLabelElement", function (magic, speciality) {
    return game.i18n.localize(CEL1922.MAGICS[magic].speciality[speciality].labelelement);
  });
}