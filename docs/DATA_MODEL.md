# Suggested Production Data Model

## users
id, email, consent_version, created_at

## homes
id, user_id, nickname, zip_code, home_type, ownership, year_band, status

## household_profiles
home_id, goals[], household_members[], sensitivities[], budget_band, diy_level, weekly_time

## questionnaire_sessions
id, home_id, version, answers_json, completion_percent, completed_at

## pillar_profiles
home_id, air_json, water_json, light_json, materials_json, comfort_json, sustainability_json, maintenance_json, lifestyle_json

## snapshots
id, home_id, questionnaire_version, rules_version, model_version, result_json, created_at

## projects
id, home_id, source_snapshot_id, title, rationale, cost_band, effort, status, target_date, completed_at

## feedback
snapshot_id, usefulness_1_5, intended_action, would_pay, free_text

## events
user_id, anonymous_id, event_name, properties_json, occurred_at

Keep medical information out of the product wherever possible. Store household considerations as optional planning preferences, not diagnoses.
