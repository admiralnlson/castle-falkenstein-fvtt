import CastleFalkenstein from "../castle-falkenstein.mjs";

// A form for inputting CastleFalkenstein settings.
export default class CastleFalkensteinSettings extends FormApplication {

	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			id: "castle-falkenstein-settings",
			title: game.i18n.localize("castle-falkenstein.settings.title"),
			template: "./systems/castle-falkenstein/src/forms/settings.hbs",
			classes: ["castle-falkenstein-settings", "sheet"],
			width: 500,
			height: "auto",
			closeOnSubmit: true,
			submitOnClose: false,
			resizable: true
		});
	}

	getData() {
		// All settings
		const all = Object.entries(CastleFalkenstein.settingDefinitions);

		// Settings expanded with all the relevant data
		const expanded = all.map(([key, def]) => ({
			...def,
			id: key,
			type: def.type.name,
			scope: def.scope ?? "world",
			name: game.i18n.localize(`castle-falkenstein.settings.${key}.name`),
			hint: game.i18n.localize(`castle-falkenstein.settings.${key}.hint`),
			value: CastleFalkenstein.settings[key],
			choices: def.getChoices ? def.getChoices() : undefined
		}));

		// Settings that are grouped
		const grouped = expanded.filter(setting => setting.group);
		
		// Settings that aren't grouped
		const settings = expanded.filter(setting => !setting.group);

		// Setting groups
		const groups = {};
		grouped.forEach(setting => {
			const group = setting.group;
			if (!groups[group]) {
				groups[group] = {
					scope: setting.scope,
					type: setting.type,
					name: game.i18n.localize(`castle-falkenstein.settings.groups.${group}.name`),
					hint: game.i18n.localize(`castle-falkenstein.settings.groups.${group}.hint`),
					settings: []
				}
			}

			groups[group].settings.push(setting);
		});

		const worldSettings = settings.filter(setting => setting.scope == "world");	
		const clientSettings = settings.filter(setting => setting.scope == "client");

		const worldGroups = Object.values(groups).filter(group => group.scope == "world");
		const clientGroups = Object.values(groups).filter(group => group.scope == "client");

		return {
			isGM: game.user.isGM,
			worldSettings,
			clientSettings,
			worldGroups,
			clientGroups 
		};
	}

	// Executes on form submission.
	async _updateObject(event, data) {
    for (let [key, value] of Object.entries(data)) {
			await game.settings.set(CastleFalkenstein.id, key, value);
		}
	}


	// Handles click events on buttons.
	_onButtonClick(event) {
		event.preventDefault();
		const action = event.currentTarget.dataset.action;
		if (this[action]) this[action](event);
	}
}
