import type { DateValue } from "@ark-ui/solid";
import { type Component, createMemo, Index } from "solid-js";
import { Portal } from "solid-js/web";
import { css } from "styled-system/css";
import { useI18n } from "~/modules/common/contexts/i18n";
import { Button } from "~/ui/button";
import { DatePicker } from "~/ui/date-picker";
import { IconButton } from "~/ui/icon-button";
import { CalendarDaysIcon } from "~/ui/icons/calendar-days-icon";
import { ChevronLeftIcon } from "~/ui/icons/chevron-left-icon";
import { ChevronRightIcon } from "~/ui/icons/chevron-right-icon";
import { XIcon } from "~/ui/icons/x-icon";
import { Input } from "~/ui/input";

export const ExpirationDatePicker: Component<{ value?: number }> = (props) => {
  const { t } = useI18n();

  const value = createMemo(() => []);

  return (
    <DatePicker.Root name="expirationDate" value={value()}>
      <DatePicker.Label>{t("cookies.form.expirationDate")}</DatePicker.Label>

      <DatePicker.Control>
        <DatePicker.Input
          asChild={(inputProps) => <Input {...inputProps()} size="xs" />}
        />
        <DatePicker.Trigger
          asChild={(triggerProps) => (
            <IconButton {...triggerProps()} variant="outline" size="xs">
              <span class={css({ srOnly: true })}>
                {t("common.openDatePicker")}
              </span>
              <CalendarDaysIcon />
            </IconButton>
          )}
        />
        <DatePicker.ClearTrigger
          asChild={(clearProps) => (
            <IconButton {...clearProps()} variant="outline" size="xs">
              <span class={css({ srOnly: true })}>{t("common.clear")}</span>
              <XIcon />
            </IconButton>
          )}
        />
      </DatePicker.Control>

      <Portal>
        <DatePicker.Positioner>
          <DatePicker.Content>
            <DatePicker.YearSelect />
            <DatePicker.MonthSelect />
            <DatePicker.View view="day">
              <DatePicker.Context>
                {(context) => (
                  <>
                    <ViewControl />

                    <DatePicker.Table>
                      <DatePicker.TableHead>
                        <DatePicker.TableRow>
                          <Index each={context().weekDays}>
                            {(weekDay) => (
                              <DatePicker.TableHeader>
                                {weekDay().short}
                              </DatePicker.TableHeader>
                            )}
                          </Index>
                        </DatePicker.TableRow>
                      </DatePicker.TableHead>

                      <DatePicker.TableBody>
                        <Index each={context().weeks}>
                          {(week) => (
                            <DatePicker.TableRow>
                              <Index each={week()}>
                                {(day) => (
                                  <TableCell
                                    cell={{ label: day().day, value: day() }}
                                  />
                                )}
                              </Index>
                            </DatePicker.TableRow>
                          )}
                        </Index>
                      </DatePicker.TableBody>
                    </DatePicker.Table>
                  </>
                )}
              </DatePicker.Context>
            </DatePicker.View>

            <DatePicker.View view="month">
              <DatePicker.Context>
                {(context) => (
                  <ViewSection
                    cells={context().getMonthsGrid({
                      columns: 4,
                      format: "short",
                    })}
                  />
                )}
              </DatePicker.Context>
            </DatePicker.View>

            <DatePicker.View view="year">
              <DatePicker.Context>
                {(context) => (
                  <ViewSection
                    cells={context().getYearsGrid({
                      columns: 4,
                    })}
                  />
                )}
              </DatePicker.Context>
            </DatePicker.View>
          </DatePicker.Content>
        </DatePicker.Positioner>
      </Portal>
    </DatePicker.Root>
  );
};

const ViewControl: Component = () => {
  const { t } = useI18n();

  return (
    <DatePicker.ViewControl>
      <DatePicker.PrevTrigger
        asChild={(triggerProps) => (
          <IconButton {...triggerProps} variant="ghost" size="sm">
            <span class={css({ srOnly: true })}>{t("common.previous")}</span>
            <ChevronLeftIcon />
          </IconButton>
        )}
      />
      <DatePicker.ViewTrigger
        asChild={(triggerProps) => (
          <Button {...triggerProps()} variant="ghost" size="sm">
            <DatePicker.RangeText />
          </Button>
        )}
      />
      <DatePicker.NextTrigger
        asChild={(triggerProps) => (
          <IconButton {...triggerProps} variant="ghost" size="sm">
            <span class={css({ srOnly: true })}>{t("common.next")}</span>
            <ChevronRightIcon />
          </IconButton>
        )}
      />
    </DatePicker.ViewControl>
  );
};

type Cell = {
  value: DateValue | number;
  label: string | number;
};

const TableCell: Component<{
  cell: Cell;
}> = (props) => {
  return (
    <DatePicker.TableCell value={props.cell.value}>
      <DatePicker.TableCellTrigger
        asChild={(triggerProps) => (
          <IconButton {...triggerProps()} variant="ghost" size="xs">
            {props.cell.label}
          </IconButton>
        )}
      />
    </DatePicker.TableCell>
  );
};

const ViewSection: Component<{ cells: Cell[][] }> = (props) => {
  return (
    <>
      <ViewControl />
      <DatePicker.Table>
        <DatePicker.TableBody>
          <Index each={props.cells}>
            {(row) => (
              <DatePicker.TableRow>
                <Index each={row()}>
                  {(cell) => <TableCell cell={cell()} />}
                </Index>
              </DatePicker.TableRow>
            )}
          </Index>
        </DatePicker.TableBody>
      </DatePicker.Table>
    </>
  );
};
