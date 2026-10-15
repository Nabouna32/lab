-- Explicitly map every inventoried production component to its real live preview.
update public.design_audit_components
set preview_key = id
where id in ('app-bar-with-search','bottom-sheet-scaffold','carousel','copy-button','date-picker-dialog','dropdown-menu','exposed-dropdown-menu','floating-action-button-menu','floating-toolbar','navigation-bar','navigation-drawer','navigation-rail','navigation-suite-scaffold','pull-to-refresh-box','scaffold','segmented-button-group','time-picker','time-picker-dialog','wide-navigation-rail');
