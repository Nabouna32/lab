alter table public.design_audit_components
  add column m3_relationship text not null default 'not-assessed'
  check (m3_relationship in ('web-adaptation', 'loculary-utility', 'not-assessed'));

update public.design_audit_components set m3_relationship = 'loculary-utility'
where id in ('app-bar-with-search','clear-button','copy-button','panel','result-panel','scroll-field','select','text-area','validation-message');

update public.design_audit_components set m3_relationship = 'web-adaptation' where m3_relationship = 'not-assessed';

comment on column public.design_audit_components.m3_relationship is 'Relationship to Material 3 concepts; classification only, not a conformance result. web-adaptation means a Loculary web implementation of an M3/AndroidX concept. loculary-utility means a Loculary-specific helper or composition, not a standalone M3 component.';
