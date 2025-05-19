import styles from './Table.module.css';

type Column = {
  header: string;
  accessor: string;
};

type Props = {
  data: Record<string, any>[];
  columns: Column[];
};

export default function Table({ data, columns }: Props) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((col, colIndex) => {
            const isDark = colIndex % 2 === 1;
            const cellClass = isDark ? styles.dark : styles.light;
            return (
              <th key={col.accessor} className={`${styles.th} ${cellClass}`}>
                {col.header}
              </th>
            );
          })}
        </tr>
      </thead>

      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((col, colIndex) => {
              const isDark = (rowIndex + colIndex) % 2 === 1;
              const cellClass = isDark ? styles.dark : styles.light;
              return (
                <td key={col.accessor} className={`${styles.td} ${cellClass}`}>
                  {row[col.accessor]}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
