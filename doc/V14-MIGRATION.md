# Migração para Foundry VTT 14

Este documento descreve o plano para tornar o sistema **Castle Falkenstein** compatível **apenas** com Foundry VTT 14 (stable). Não há objetivo de manter compatibilidade com as versões 9–12.

**Status:** em andamento — Fase 0 concluída na branch de desenvolvimento V14.

## Estado do sistema (baseline v3.x)

| Aspecto | Situação antes da migração |
|--------|----------------------------|
| `system.json` | `minimum: 9`, `verified: 12.330`, `maximum: 12` |
| Entrada | ES modules: `lib-wrapper-shim` → `socketlib` → `castle-falkenstein.mjs` |
| Dados | `TypeDataModel` para Actor `character` e Items `ability`, `weapon`, `possession`, `spell` |
| UI | Application V1: `ActorSheet`, `ItemSheet`, `CardsHand`, `CardsConfig`, `FormApplication` |
| Compendiums | YAML → NeDB (`.db`) via `src/packs/gulpfile.js` |
| Legado | `template.json` no zip de release; ramificações `game.release.generation` |

O núcleo do sistema é o **motor de cartas** (baralhos Fortune/Sorcery, mãos por personagem, feats, magia). A migração deve preservar esse fluxo acima de refactors cosméticos.

### Arquivos centrais

| Área | Arquivos |
|------|----------|
| Bootstrap | `src/castle-falkenstein.mjs`, `src/config.mjs` |
| Atores | `src/documents/actor.mjs`, `actor-character-datamodel.mjs`, `actor-*-sheet.*` |
| Itens | `src/documents/item.mjs`, `item-datamodel-*.mjs`, `item-sheet-*.mjs` |
| Cartas | `src/documents/cards.mjs`, `hand-sheet.mjs`, `deck-sheet.mjs` |
| Combate | `src/documents/combat.mjs`, `combatant.mjs` |
| Formulários | `src/forms/define-spell.mjs` |
| Integração | `src/module-integration.mjs` |
| Libs embutidas | `src/lib/socketlib/`, `src/lib/lib-wrapper-shim/` (shim não usado pelo sistema) |

### Débitos técnicos conhecidos (corrigir durante a migração)

1. `onRenderPlayerList` duplicado em `castle-falkenstein.mjs`
2. Bug de precedência em `refreshActorSheetIfDiary`: `!journalEntry.getFlag(...) === "diary"` → deve ser `journalEntry.getFlag(...) !== "diary"`
3. `lib-wrapper-shim` carregado no manifest mas não referenciado em `src/`
4. Hooks e DOM ainda no padrão jQuery (`html.find`, `$()`, `html[0]`)

## Requisitos Foundry 14

1. `system.json`: `"compatibility": { "minimum": "14", "verified": "14", "maximum": "14" }`
2. **Node.js 24** no ambiente de desenvolvimento (instalação do Foundry 14)
3. Remover ramificações `game.release.generation < 11/12`
4. Remover `template.json` do artefato de release (dados já em `documentTypes` no manifest)
5. Configurar `.vscode` para Foundry 14.x

Referências: [API Migration Guides](https://foundryvtt.com/article/migration/), [issue #13436](https://github.com/foundryvtt/foundryvtt/issues/13436), [ApplicationV2 (wiki)](https://foundryvtt.wiki/en/development/guides/applicationV2-conversion-guide).

---

## Fases

### Fase 0 — Preparação

**Objetivo:** ambiente e manifesto V14-only.

- [x] Atualizar `system.json` (compatibilidade)
- [x] Remover `template.json` do zip de release (CI)
- [x] Atualizar README (badge e requisito FVTT 14)
- [x] Entrada no CHANGELOG (breaking, v4.x planejada)
- [x] Documentar este plano (`doc/V14-MIGRATION.md`)
- [x] Atualizar `.vscode` para Foundry 14 (ajustar pasta local conforme instalação)
- [ ] Instalar Foundry 14 stable e validar que o mundo abre (desenvolvedor)

**Critério de aceite:** sistema listado como compatível só com 14 no setup; documentação e manifest alinhados.

---

### Fase 1 — API e hooks (sem migrar sheets)

**Objetivo:** core carrega; chat e combate funcionam com mudanças pontuais.

| Mudança V14 | Onde |
|-------------|------|
| `renderChatMessage` → `renderChatMessageHTML` | `castle-falkenstein.mjs` — `HTMLElement`, não jQuery |
| `core.rollMode` → `core.messageMode` | `onPreCreateChatMessage`, `onRenderSidebarTab`, `actor-character-sheet.mjs` |
| Valores de modo de mensagem V14 | `onRenderSidebarTab`, `onPreCreateChatMessage` |
| `Roll.toMessage({ rollMode })` → `messageMode` | `actor-character-sheet.mjs` |
| Remover `CHAT_MESSAGE_TYPES` | `createChatMessage` |
| Remover ramos `generation >= 11/12` | `onInit`, `onReady`, `registerSettings`, `actor-loot-sheet` |
| `DocumentIdField` para decks | `registerSettings` (sempre) |

Validar hooks: `renderSidebarTab`, `renderCombatTracker`, `renderPlayerList`.

**Critério de aceite:** mundo carrega; chat e initiative editável (GM); seletor de visibilidade customizado.

---

### Fase 2 — Compendiums e build

**Objetivo:** packs no formato atual do core (LevelDB).

- Migrar `src/packs/gulpfile.js` para `@foundryvtt/foundryvtt-cli` (`fvtt package pack`)
- Manter fonte em `src/packs/yaml/`
- Ajustar `path` em `system.json` se necessário
- CI: compilar `build/packs/` antes do zip
- Testar Babele (`lang/babele/`)

**Critério de aceite:** compendiums abrem; drag-and-drop para fichas funciona.

---

### Fase 3 — ApplicationV2 nas fichas

**Objetivo:** substituir Application V1.

Ordem sugerida:

1. Item sheets (4)
2. Loot + Character sheet
3. `DefineSpell`
4. `HandSheet` (mais complexo)
5. `DeckSheet`

Revisar `src/css/castle-falkenstein.css` e `cf-cards.css` (camadas CSS V13+).

**Critério de aceite:** fichas, mãos, feats, magia e PopOut funcionais.

---

### Fase 4 — Socket e dependências

| Componente | Ação |
|------------|------|
| socketlib embutido | Atualizar ou usar módulo oficial V14 |
| lib-wrapper-shim | Remover de `esmodules` |
| Babele / PopOut / Item Piles | Validar versões V14 |

---

### Fase 5 — QA e release

Matriz P0: decks auto-criados, personagem, mãos host/jogador, draw/pass/recall, feat, sorcery, combate.

Release **v4.0.0** com nota de breaking: mundos devem ser migrados no Foundry (backup); sistema não suporta FVTT ≤12.

---

## Estimativa de esforço

| Fase | Esforço |
|------|---------|
| 0 | 0,5–1 d |
| 1 | 1–2 d |
| 2 | 1–2 d |
| 3 | 5–10 d |
| 4 | 0,5–1 d |
| 5 | 2–3 d |
| **Total** | **~10–19 d** |

Gargalo: **Hand Sheet** + **Character sheet**.

## Ordem de execução

```
F0 → F1 → F2 → F3 → F4 → F5
```

## Riscos

1. Mundos existentes: schema TypeDataModel tende a ser OK; risco maior em packs NeDB vs LevelDB.
2. Módulos de terceiros precisam versões V14 (Babele, PopOut!, Item Piles).
3. ApplicationV2 não é opcional a médio prazo para manutenção limpa.
