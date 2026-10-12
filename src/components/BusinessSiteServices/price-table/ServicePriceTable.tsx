import { safeHref } from '../../../utils/safeHref'
import type { ServicePriceColumn, ServicePriceRow } from '../helpers/pricing'
import { ServiceName } from '../service-name/ServiceName'

export function ServicePriceTable({ rows, columns, title }: {
  rows: readonly ServicePriceRow[]
  columns: readonly ServicePriceColumn[]
  title: string
}) {
  return (
    <div className="pz-business-services__table-wrap">
      <table className="pz-business-services__table" aria-label={`${title} prices`}>
        <thead>
          <tr><th scope="col">Service</th>{columns.map((column) => <th scope="col" key={column.id}>{column.label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map(({ service, prices }) => {
            const href = safeHref(service.href)
            return (
              <tr key={service.id}>
                <th scope="row">
                  {href
                    ? <a className="pz-business-services__service-link" href={href}><ServiceName service={service} /></a>
                    : <span className="pz-business-services__service-name"><ServiceName service={service} /></span>}
                </th>
                {columns.map((column) => {
                  const values = prices.get(column.id)
                  return (
                    <td key={column.id}>
                      <span className="pz-business-services__price-label" aria-hidden="true">{column.label}</span>
                      <span className="pz-business-services__price-values">
                        {values?.length ? values.map((value, index) => <span key={index}>{value}</span>) : <>
                          <span className="pz-business-services__missing-price" aria-hidden="true">—</span>
                          <span className="pz-business-services__sr-only">Price not provided</span>
                        </>}
                      </span>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
