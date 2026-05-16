import collect from 'collect.js';
import download from 'downloadjs';
import { v4 as uuid } from 'uuid';
import { defineStore } from 'pinia';
import { namespace } from './useProjectStores';
import useTemplateStore from './useTemplateStore';
import usePreferencesStore from '@/composables/usePreferencesStore';
import { cloneDeep, replace, omit } from 'lodash';
import { translate } from '@/i18n/messages';

export default function (id) {
    return defineStore(id, {
        state: () => ({
            version: '1.26.1',
            modified: false,
            page: {},
            settings: {},
            viewport: {
                x: 0,
                y: -150,
                zoom: 1,
            },
            tab: {
                order: 0,
                name: null,
                created_at: new Date(),
                id: replace(id, namespace, ''),
            },
        }),

        actions: {
            /**
             * Get a clone of the project.
             *
             * @returns {*}
             */
            clone() {
                const clone = cloneDeep(this.$state);

                clone.tab.id = uuid();

                return clone;
            },

            /**
             * Export the project into a JSON config file.
             */
            export() {
                const state = this.clone();
                const preferences = usePreferencesStore();

                const name =
                    state.tab.name ||
                    translate(preferences.uiLocale, 'placeholder.defaultProjectName');

                download(JSON.stringify(state, null, 2), `${name}.json`);
            },

            /**
             * Export the project into a JSON file for an API request.
             */
            exportForApi() {
                const state = this.clone();

                const json = {
                    settings: omit(state.settings, 'image'),
                    editors: collect(state.page.editors)
                        .map((editor) => omit(editor, ['id', 'tabSize']))
                        .toArray(),
                };

                const name = state.tab.name || 'json';

                download(JSON.stringify(json, null, 2), `${name}.json`);
            },

            /**
             * Save the project as a template.
             */
            saveAsTemplate() {
                const templates = useTemplateStore();
                const preferences = usePreferencesStore();

                const project = this.clone();

                project.tab.created_at = new Date();

                project.tab.name =
                    project.tab.name ||
                    translate(preferences.uiLocale, 'placeholder.defaultProjectName');

                templates.add(project);
            },
        },

        persist: {
            key: id,
            storage: import.meta.client ? localStorage : undefined,
        },
    });
}
